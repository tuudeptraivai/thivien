import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DictionaryEntry } from './dto/dictionary-entry.dto';
import { LookupResponseDto } from './dto/lookup-dictionary.dto';
import {
  DICTIONARY_RESPONSE_SCHEMA,
  DICTIONARY_SYSTEM_PROMPT,
} from './dictionary.prompt';
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
const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';
const GEMINI_API_BASE =
  'https://generativelanguage.googleapis.com/v1beta/models';

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

    const apiKey = this.config.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      try {
        const aiResult = await this.lookupWithGemini(query, apiKey);
        if (aiResult.results.length > 0) {
          this.writeCache(cacheKey, aiResult);
          return aiResult;
        }
        this.logger.warn(`Gemini trả về kết quả rỗng cho "${query}", fallback offline`);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        this.logger.warn(`Gemini API lỗi (${message}), fallback offline`);
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
      ? 'Đang dùng từ điển tham khảo nội bộ (chưa cấu hình GEMINI_API_KEY).'
      : 'Đang dùng từ điển tham khảo nội bộ do dịch vụ AI tạm thời không khả dụng.';

    return {
      source: 'offline',
      results,
      suggestedQueries,
      message: results.length > 0 ? message : `${message} Không tìm thấy mục phù hợp.`,
    };
  }

  private async lookupWithGemini(
    query: string,
    apiKey: string,
  ): Promise<LookupResponseDto> {
    const model =
      this.config.get<string>('GEMINI_MODEL') || DEFAULT_GEMINI_MODEL;

    const body = {
      systemInstruction: {
        parts: [{ text: DICTIONARY_SYSTEM_PROMPT }],
      },
      contents: [
        {
          role: 'user',
          parts: [{ text: `Tra cứu: ${query}` }],
        },
      ],
      generationConfig: {
        responseMimeType: 'application/json',
        responseSchema: DICTIONARY_RESPONSE_SCHEMA,
        maxOutputTokens: 4096,
        // Tắt "thinking" của gemini-2.5-flash: tác vụ tra từ không cần suy luận
        // sâu, và quota thinking ăn hết maxOutputTokens khiến JSON bị cắt cụt.
        thinkingConfig: { thinkingBudget: 0 },
      },
    };

    const url = `${GEMINI_API_BASE}/${encodeURIComponent(model)}:generateContent`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20_000);

    let res: Response;
    try {
      res = await fetch(url, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'x-goog-api-key': apiKey,
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
      candidates?: Array<{
        content?: { parts?: Array<{ text?: string }> };
      }>;
    };

    const text = payload.candidates?.[0]?.content?.parts
      ?.map((p) => p.text ?? '')
      .join('')
      .trim();

    if (!text) {
      throw new Error('Gemini không trả về nội dung hợp lệ');
    }

    let parsed: {
      results?: DictionaryEntry[];
      suggestedQueries?: string[];
      message?: string;
    };
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error('Gemini trả về JSON không hợp lệ');
    }

    const results = Array.isArray(parsed.results) ? parsed.results : [];
    const suggestedQueries = Array.isArray(parsed.suggestedQueries)
      ? parsed.suggestedQueries.filter((s): s is string => typeof s === 'string')
      : [];

    return {
      source: 'ai',
      results,
      suggestedQueries,
      message: parsed.message,
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
