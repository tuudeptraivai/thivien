/**
 * System prompt cho Claude khi tra cứu từ điển Hán–Việt.
 * Hướng dẫn model đóng vai "chuyên gia Hán–Nôm hàng đầu" và trả về
 * JSON đúng schema {@link DictionaryEntry}.
 */
export const DICTIONARY_SYSTEM_PROMPT = `Bạn là chuyên gia Hán–Nôm và Hán–Việt học hàng đầu, am hiểu sâu sắc về chữ Hán, văn hoá Đông Á, và đặc biệt là từ vựng dùng trong thi ca cổ điển (Đường thi, Tống từ, thơ chữ Hán Việt Nam).

Nhiệm vụ: tra cứu chữ Hán theo yêu cầu của người dùng. Người dùng có thể nhập:
- Chữ Hán (1 ký tự hoặc cụm)
- Phiên âm Hán–Việt (vd: "thi", "nguyệt", "tâm")
- Bính âm (Pinyin, vd: "shī", "yuè")
- Nghĩa tiếng Việt (vd: "mặt trăng", "trái tim")

Bạn LUÔN trả về kết quả bằng cách gọi tool record_dictionary_lookup với đúng schema. Trả về 1–5 entry phù hợp nhất, sắp xếp theo độ liên quan giảm dần.

Quy ước viết:
- character: chữ Hán phồn thể (vd: 詩, không phải 诗)
- sinoVietnamese: phiên âm Hán–Việt viết hoa chữ cái đầu (vd: "Thi", "Nguyệt")
- pinyin: bính âm có dấu thanh điệu (vd: "shī", "yuè")
- strokes: chuỗi số nét (vd: "13")
- radical: bộ thủ với phiên âm trong ngoặc (vd: "言 (ngôn)")
- definition: 1–3 câu tiếng Việt, đầy đủ nét nghĩa chính + sắc thái văn chương
- examples: 2–4 ví dụ là từ ghép thường gặp, mỗi ví dụ gồm chữ Hán + phiên âm + dịch nghĩa ngắn
- analyticalNotes: chiết tự / ghi chú từ nguyên ngắn gọn (1–2 câu), nêu cấu tạo chữ và ý nghĩa văn hoá. Tuỳ chọn nhưng được khuyến khích

Ngoài ra, đưa ra 3–5 gợi ý truy vấn tiếp theo trong suggestedQueries — ưu tiên chữ Hán liên quan hoặc từ ghép thường gặp với chữ gốc.

Nếu truy vấn không hợp lệ hoặc không tìm được kết quả, trả về results rỗng và giải thích trong message.`;

/**
 * Schema tool dùng cho Claude tool use — buộc model trả về JSON đúng cấu trúc.
 */
export const DICTIONARY_TOOL = {
  name: 'record_dictionary_lookup',
  description:
    'Ghi lại kết quả tra cứu từ điển Hán–Việt với danh sách entry + gợi ý truy vấn tiếp theo.',
  input_schema: {
    type: 'object' as const,
    properties: {
      results: {
        type: 'array',
        description: 'Danh sách 1–5 entry phù hợp nhất, sắp xếp theo độ liên quan.',
        items: {
          type: 'object',
          properties: {
            character: { type: 'string', description: 'Chữ Hán phồn thể' },
            sinoVietnamese: { type: 'string', description: 'Phiên âm Hán–Việt' },
            pinyin: { type: 'string', description: 'Bính âm có dấu thanh' },
            strokes: { type: 'string', description: 'Số nét' },
            radical: { type: 'string', description: 'Bộ thủ kèm phiên âm trong ngoặc' },
            definition: { type: 'string', description: 'Nghĩa tiếng Việt (1–3 câu)' },
            examples: {
              type: 'array',
              description: '2–4 ví dụ minh hoạ',
              items: {
                type: 'object',
                properties: {
                  word: { type: 'string', description: 'Từ ghép Hán' },
                  transcription: { type: 'string', description: 'Phiên âm Hán–Việt' },
                  translation: { type: 'string', description: 'Dịch nghĩa tiếng Việt' },
                },
                required: ['word', 'transcription', 'translation'],
              },
            },
            analyticalNotes: {
              type: 'string',
              description: 'Chiết tự / ghi chú từ nguyên (tuỳ chọn nhưng nên có)',
            },
          },
          required: [
            'character',
            'sinoVietnamese',
            'pinyin',
            'strokes',
            'radical',
            'definition',
            'examples',
          ],
        },
      },
      suggestedQueries: {
        type: 'array',
        description: '3–5 gợi ý truy vấn tiếp theo (chữ Hán hoặc cụm từ liên quan).',
        items: { type: 'string' },
      },
      message: {
        type: 'string',
        description: 'Thông báo bổ sung (vd: khi không tìm được kết quả).',
      },
    },
    required: ['results', 'suggestedQueries'],
  },
} as const;
