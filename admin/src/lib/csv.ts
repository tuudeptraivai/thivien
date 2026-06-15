/**
 * Tiện ích CSV tối giản nhưng đúng RFC 4180: hỗ trợ ô có dấu phẩy, xuống dòng
 * và dấu nháy kép escaped ("") — cần thiết vì nội dung bài thơ thường nhiều dòng.
 */

/** Parse text CSV → mảng các dòng, mỗi dòng là mảng ô (string). */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let field = '';
  let row: string[] = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n') {
      row.push(field);
      rows.push(row);
      field = '';
      row = [];
    } else if (c === '\r') {
      // bỏ qua, xử lý ở \n
    } else {
      field += c;
    }
  }
  // ô / dòng cuối (nếu file không kết thúc bằng newline)
  if (field !== '' || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

/**
 * Chuyển mảng dòng CSV → mảng object theo dòng tiêu đề (dòng đầu).
 * Bỏ qua các dòng rỗng hoàn toàn. Giá trị giữ nguyên (không trim) để bảo toàn
 * định dạng nội dung thơ.
 */
export function csvToObjects(rows: string[][]): Record<string, string>[] {
  if (rows.length === 0) return [];
  const headers = rows[0].map((h) => h.trim());
  return rows
    .slice(1)
    .filter((r) => r.some((cell) => cell.trim() !== ''))
    .map((r) => {
      const obj: Record<string, string> = {};
      headers.forEach((h, i) => {
        obj[h] = r[i] ?? '';
      });
      return obj;
    });
}

/** Bọc 1 ô khi cần (có phẩy, nháy kép hoặc xuống dòng). */
function escapeCell(value: string): string {
  return /[",\n\r]/.test(value)
    ? '"' + value.replace(/"/g, '""') + '"'
    : value;
}

/** Tạo nội dung CSV từ headers + các dòng. Thêm BOM để Excel đọc đúng UTF-8. */
export function toCsv(headers: string[], rows: string[][]): string {
  const lines = [headers, ...rows].map((r) => r.map(escapeCell).join(','));
  return '﻿' + lines.join('\r\n');
}

/**
 * Giải mã file CSV về chuỗi UTF-8 đúng, chịu được nhiều kiểu xuất file:
 * - UTF-16 LE/BE (Excel "Unicode Text") nhận diện qua BOM.
 * - UTF-8 (có/không BOM) — TextDecoder tự bỏ BOM.
 * - Cố gắng sửa mojibake (UTF-8 bị đọc nhầm thành Latin-1) khi an toàn.
 */
export function decodeCsvBuffer(buf: ArrayBuffer): string {
  const b = new Uint8Array(buf);
  if (b.length >= 2 && b[0] === 0xff && b[1] === 0xfe)
    return new TextDecoder('utf-16le').decode(b);
  if (b.length >= 2 && b[0] === 0xfe && b[1] === 0xff)
    return new TextDecoder('utf-16be').decode(b);
  const text = new TextDecoder('utf-8').decode(b);
  return repairMojibake(text);
}

/**
 * Nếu chuỗi có dấu hiệu mojibake (UTF-8 bị giải mã thành Latin-1) và toàn bộ ký
 * tự nằm trong khoảng ≤ 0xFF, thử diễn giải lại bytes theo UTF-8. Thất bại thì
 * giữ nguyên — không làm hỏng file vốn đã đúng.
 */
function repairMojibake(s: string): string {
  if (!/Ã[-¿]|Æ°|Æ¡|á»|áº|Ä‘/.test(s)) return s;
  for (const ch of s) if (ch.charCodeAt(0) > 0xff) return s;
  try {
    const bytes = Uint8Array.from(s, (ch) => ch.charCodeAt(0) & 0xff);
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return s;
  }
}

/** Tải một chuỗi xuống dưới dạng file. */
export function downloadFile(
  filename: string,
  content: string,
  mime = 'text/csv;charset=utf-8',
) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
