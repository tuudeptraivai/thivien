import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DictionaryEntry } from './dto/dictionary-entry.dto';
import { LookupResponseDto } from './dto/lookup-dictionary.dto';
import { DICTIONARY_SYSTEM_PROMPT, DICTIONARY_TOOL } from './dictionary.prompt';
import {
  getPopularOffline,
  OFFLINE_ENTRIES,
  searchOffline,
} from './dictionary.offline-data';

interface CacheEntry {
  expiresAt: number;
  value: LookupResponseDto;
}

const CACHE_TTL_MS = 30 * 60 * 1000; // 30 phút
const CACHE_MAX_ENTRIES = 256;
const CLAUDE_MODEL = 'claude-haiku-4-5';
const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages';
const CLAUDE_API_VERSION = '2023-06-01';

@Injectable()
export class DictionaryService {
  private readonly logger = new Logger(DictionaryService.name);
  private readonly cache = new Map<string, CacheEntry>();

  constructor(private readonly config: ConfigService) {}

  async lookup(rawQuery: string): Promise<LookupResponseDto> {
    const query = rawQuery.trim();
    if (!query) {
      return {
        source: 'offline',
        results: [],
        suggestedQueries: getPopularOffline().map((e) => e.character),
        message: 'Vui lòng nhập từ khoá để tra cứu.',
      };
    }

    const cacheKey = query.toLowerCase();
    const cached = this.readCache(cacheKey);
    if (cached) return cached;

    const apiKey = this.config.get<string>('ANTHROPIC_API_KEY');
    if (apiKey) {
      try {
        const aiResult = await this.lookupWithClaude(query, apiKey);
        if (aiResult.results.length > 0) {
          this.writeCache(cacheKey, aiResult);
          return aiResult;
        }
        this.logger.warn(`Claude trả về kết quả rỗng cho "${query}", fallback offline`);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        this.logger.warn(`Claude API lỗi (${message}), fallback offline`);
      }
    }

    const fallback = this.lookupOffline(query, !apiKey);
    this.writeCache(cacheKey, fallback);
    return fallback;
  }

  popular(): { source: 'offline'; results: DictionaryEntry[] } {
    return { source: 'offline', results: getPopularOffline() };
  }

  // ---------------------------------------------------------------------------
  // Internals
  // ---------------------------------------------------------------------------

  private lookupOffline(query: string, noApiKey: boolean): LookupResponseDto {
    const results = searchOffline(query);
    const suggestedQueries = (
      results.length > 0
        ? OFFLINE_ENTRIES.filter((e) => !results.includes(e)).slice(0, 4)
        : getPopularOffline().slice(0, 4)
    ).map((e) => e.character);

    const message = noApiKey
      ? 'Đang dùng từ điển tham khảo nội bộ (chưa cấu hình ANTHROPIC_API_KEY).'
      : 'Đang dùng từ điển tham khảo nội bộ do dịch vụ AI tạm thời không khả dụng.';

    return {
      source: 'offline',
      results,
      suggestedQueries,
      message: results.length > 0 ? message : `${message} Không tìm thấy mục phù hợp.`,
    };
  }

  private async lookupWithClaude(
    query: string,
    apiKey: string,
  ): Promise<LookupResponseDto> {
    const body = {
      model: CLAUDE_MODEL,
      max_tokens: 2048,
      system: DICTIONARY_SYSTEM_PROMPT,
      tools: [DICTIONARY_TOOL],
      tool_choice: { type: 'tool', name: DICTIONARY_TOOL.name },
      messages: [
        {
          role: 'user',
          content: `Tra cứu: ${query}`,
        },
      ],
    };

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);

    let res: Response;
    try {
      res = await fetch(CLAUDE_API_URL, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': CLAUDE_API_VERSION,
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    if (!res.ok) {
      const errText = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status}: ${errText.slice(0, 200)}`);
    }

    const payload = (await res.json()) as {
      content?: Array<{
        type: string;
        name?: string;
        input?: {
          results?: DictionaryEntry[];
          suggestedQueries?: string[];
          message?: string;
        };
      }>;
    };

    const toolUse = payload.content?.find(
      (block) => block.type === 'tool_use' && block.name === DICTIONARY_TOOL.name,
    );

    if (!toolUse?.input) {
      throw new Error('Claude không trả về tool_use hợp lệ');
    }

    const results = Array.isArray(toolUse.input.results) ? toolUse.input.results : [];
    const suggestedQueries = Array.isArray(toolUse.input.suggestedQueries)
      ? toolUse.input.suggestedQueries.filter((s): s is string => typeof s === 'string')
      : [];

    return {
      source: 'ai',
      results,
      suggestedQueries,
      message: toolUse.input.message,
    };
  }

  private readCache(key: string): LookupResponseDto | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (entry.expiresAt < Date.now()) {
      this.cache.delete(key);
      return null;
    }
    return entry.value;
  }

  private writeCache(key: string, value: LookupResponseDto) {
    if (this.cache.size >= CACHE_MAX_ENTRIES) {
      const oldestKey = this.cache.keys().next().value;
      if (oldestKey !== undefined) this.cache.delete(oldestKey);
    }
    this.cache.set(key, { expiresAt: Date.now() + CACHE_TTL_MS, value });
  }
}
