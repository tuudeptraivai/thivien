import { DictionaryEntry } from './dto/dictionary-entry.dto';

/**
 * Bộ dữ liệu Hán–Việt tham khảo (offline fallback).
 * Tổng 24 mục — gồm các chữ thường gặp trong thơ ca và kinh điển.
 * Khớp schema {@link DictionaryEntry}.
 */
export const OFFLINE_ENTRIES: DictionaryEntry[] = [
  {
    character: '詩',
    sinoVietnamese: 'Thi',
    pinyin: 'shī',
    strokes: '13',
    radical: '言 (ngôn)',
    definition:
      'Thơ ca, sự sáng tác thơ văn. Một trong Lục nghệ của Nho học — thể loại biểu đạt tình cảm và tư tưởng bằng ngôn từ có nhịp điệu.',
    examples: [
      { word: '詩歌', transcription: 'Thi ca', translation: 'thơ và nhạc' },
      { word: '詩人', transcription: 'Thi nhân', translation: 'nhà thơ' },
      { word: '唐詩', transcription: 'Đường thi', translation: 'thơ thời nhà Đường' },
    ],
    analyticalNotes:
      'Chiết tự: bộ 言 (ngôn — lời nói) ghép với 寺 (tự — chùa, nơi trang nghiêm). Hàm ý lời nói trang trọng, có quy củ.',
  },
  {
    character: '月',
    sinoVietnamese: 'Nguyệt',
    pinyin: 'yuè',
    strokes: '4',
    radical: '月 (nguyệt)',
    definition:
      'Mặt trăng; tháng (đơn vị thời gian). Trong thơ Đường thường gắn với nỗi nhớ quê, tâm trạng cô đơn của thi nhân.',
    examples: [
      { word: '明月', transcription: 'Minh nguyệt', translation: 'trăng sáng' },
      { word: '月光', transcription: 'Nguyệt quang', translation: 'ánh trăng' },
      { word: '月夜', transcription: 'Nguyệt dạ', translation: 'đêm trăng' },
    ],
    analyticalNotes:
      'Tượng hình từ hình lưỡi liềm của mặt trăng khuyết. Là một trong bộ thủ Khang Hi.',
  },
  {
    character: '心',
    sinoVietnamese: 'Tâm',
    pinyin: 'xīn',
    strokes: '4',
    radical: '心 (tâm)',
    definition:
      'Trái tim; tâm hồn; nội tâm; lòng dạ. Thường dùng ẩn dụ về tình cảm, ý chí, đạo đức trong triết học Đông phương.',
    examples: [
      { word: '心情', transcription: 'Tâm tình', translation: 'tâm trạng, cảm xúc' },
      { word: '心地', transcription: 'Tâm địa', translation: 'lòng dạ, bản tâm' },
      { word: '一心', transcription: 'Nhất tâm', translation: 'một lòng, chuyên tâm' },
    ],
    analyticalNotes:
      'Tượng hình của quả tim. Khi làm thiên bàng bên trái biến thành 忄 (thụ tâm).',
  },
  {
    character: '花',
    sinoVietnamese: 'Hoa',
    pinyin: 'huā',
    strokes: '7',
    radical: '艸 (thảo)',
    definition:
      'Bông hoa; vẻ đẹp; sự rực rỡ. Trong thơ là biểu tượng cho cái đẹp ngắn ngủi, người con gái, mùa xuân.',
    examples: [
      { word: '花園', transcription: 'Hoa viên', translation: 'vườn hoa' },
      { word: '梅花', transcription: 'Mai hoa', translation: 'hoa mai' },
      { word: '花容', transcription: 'Hoa dung', translation: 'dung nhan đẹp như hoa' },
    ],
    analyticalNotes:
      'Bộ 艸 (cỏ) trên + 化 (hoá — biến hoá). Ý: cỏ biến hoá nở thành hoa.',
  },
  {
    character: '春',
    sinoVietnamese: 'Xuân',
    pinyin: 'chūn',
    strokes: '9',
    radical: '日 (nhật)',
    definition:
      'Mùa xuân; tuổi trẻ; tình ái. Biểu tượng của sự sống, khởi đầu, sinh sôi.',
    examples: [
      { word: '春天', transcription: 'Xuân thiên', translation: 'mùa xuân' },
      { word: '青春', transcription: 'Thanh xuân', translation: 'tuổi trẻ' },
      { word: '春風', transcription: 'Xuân phong', translation: 'gió xuân' },
    ],
    analyticalNotes:
      'Hợp thể của 屯 (cỏ non đâm xuyên đất) và 日 (mặt trời) — mặt trời chiếu xuống làm cây cỏ nảy mầm.',
  },
  {
    character: '風',
    sinoVietnamese: 'Phong',
    pinyin: 'fēng',
    strokes: '9',
    radical: '風 (phong)',
    definition:
      'Gió; phong tục; phong cách; thi phong. Trong Kinh Thi, "Phong" là một trong ba thể (Phong, Nhã, Tụng).',
    examples: [
      { word: '春風', transcription: 'Xuân phong', translation: 'gió xuân' },
      { word: '風月', transcription: 'Phong nguyệt', translation: 'gió trăng — chuyện thanh nhã' },
      { word: '風流', transcription: 'Phong lưu', translation: 'phong nhã, hào hoa' },
    ],
    analyticalNotes:
      'Cổ tự gồm 凡 (phàm — biểu âm) và 虫 (trùng), người xưa cho rằng gió thổi sinh ra côn trùng.',
  },
  {
    character: '雪',
    sinoVietnamese: 'Tuyết',
    pinyin: 'xuě',
    strokes: '11',
    radical: '雨 (vũ)',
    definition:
      'Tuyết — mưa kết tinh thành hạt trắng. Trong thơ là biểu tượng của sự thuần khiết, lạnh lẽo, cô độc.',
    examples: [
      { word: '白雪', transcription: 'Bạch tuyết', translation: 'tuyết trắng' },
      { word: '雪山', transcription: 'Tuyết sơn', translation: 'núi tuyết' },
      { word: '風雪', transcription: 'Phong tuyết', translation: 'gió tuyết, gian khổ' },
    ],
    analyticalNotes:
      'Bộ 雨 (mưa) + 彐 (kí — bàn tay quét). Hàm ý mưa hoá tuyết có thể cầm nắm được.',
  },
  {
    character: '山',
    sinoVietnamese: 'Sơn',
    pinyin: 'shān',
    strokes: '3',
    radical: '山 (sơn)',
    definition:
      'Núi; vùng cao nguyên. Biểu tượng cho sự vững chãi, ẩn dật, đạo gia.',
    examples: [
      { word: '高山', transcription: 'Cao sơn', translation: 'núi cao' },
      { word: '山水', transcription: 'Sơn thuỷ', translation: 'núi sông, phong cảnh' },
      { word: '深山', transcription: 'Thâm sơn', translation: 'núi sâu' },
    ],
    analyticalNotes:
      'Tượng hình của ba đỉnh núi nối liền.',
  },
  {
    character: '水',
    sinoVietnamese: 'Thuỷ',
    pinyin: 'shuǐ',
    strokes: '4',
    radical: '水 (thuỷ)',
    definition:
      'Nước; sông; chất lỏng. Một trong Ngũ hành (Kim, Mộc, Thuỷ, Hoả, Thổ).',
    examples: [
      { word: '山水', transcription: 'Sơn thuỷ', translation: 'núi sông' },
      { word: '清水', transcription: 'Thanh thuỷ', translation: 'nước trong' },
      { word: '流水', transcription: 'Lưu thuỷ', translation: 'nước chảy' },
    ],
    analyticalNotes:
      'Tượng hình của dòng nước chảy. Khi làm thiên bàng thành 氵 (tam điểm thuỷ).',
  },
  {
    character: '天',
    sinoVietnamese: 'Thiên',
    pinyin: 'tiān',
    strokes: '4',
    radical: '大 (đại)',
    definition:
      'Trời; bầu trời; thiên nhiên; đạo trời. Khái niệm cao nhất trong triết học Nho — Đạo.',
    examples: [
      { word: '天地', transcription: 'Thiên địa', translation: 'trời đất' },
      { word: '天命', transcription: 'Thiên mệnh', translation: 'mệnh trời' },
      { word: '天子', transcription: 'Thiên tử', translation: 'con trời, hoàng đế' },
    ],
    analyticalNotes:
      'Chữ 大 (đại — người) thêm vạch ngang phía trên — chỉ vùng cao quá đầu người, tức trời.',
  },
  {
    character: '地',
    sinoVietnamese: 'Địa',
    pinyin: 'dì',
    strokes: '6',
    radical: '土 (thổ)',
    definition:
      'Đất; vùng đất; địa lý. Cùng với Thiên (trời) tạo cặp đối lập âm — dương.',
    examples: [
      { word: '土地', transcription: 'Thổ địa', translation: 'đất đai' },
      { word: '天地', transcription: 'Thiên địa', translation: 'trời đất' },
      { word: '地方', transcription: 'Địa phương', translation: 'vùng địa lý' },
    ],
    analyticalNotes:
      'Bộ 土 (thổ — đất) + 也 (dã — biểu âm).',
  },
  {
    character: '人',
    sinoVietnamese: 'Nhân',
    pinyin: 'rén',
    strokes: '2',
    radical: '人 (nhân)',
    definition:
      'Người; con người; nhân tính. Trong Nho gia là một trong Tam tài (Thiên, Địa, Nhân).',
    examples: [
      { word: '人類', transcription: 'Nhân loại', translation: 'loài người' },
      { word: '詩人', transcription: 'Thi nhân', translation: 'nhà thơ' },
      { word: '愛人', transcription: 'Ái nhân', translation: 'người yêu' },
    ],
    analyticalNotes:
      'Tượng hình của hai chân người đứng. Khi làm thiên bàng bên trái biến thành 亻.',
  },
  {
    character: '愛',
    sinoVietnamese: 'Ái',
    pinyin: 'ài',
    strokes: '13',
    radical: '心 (tâm)',
    definition:
      'Yêu; thương; ái mộ. Phạm trù đạo đức quan trọng của Nho — Phật — Đạo.',
    examples: [
      { word: '愛人', transcription: 'Ái nhân', translation: 'người yêu' },
      { word: '愛情', transcription: 'Ái tình', translation: 'tình yêu' },
      { word: '愛國', transcription: 'Ái quốc', translation: 'yêu nước' },
    ],
    analyticalNotes:
      'Phía trên là 爫 (trảo — tay), giữa là 冖 + 心 (tâm), dưới là 夊 — hàm ý tay nâng niu trái tim, đi tới đi lui vì người mình thương.',
  },
  {
    character: '夢',
    sinoVietnamese: 'Mộng',
    pinyin: 'mèng',
    strokes: '13',
    radical: '夕 (tịch)',
    definition:
      'Giấc mơ; mộng tưởng. Trong thơ Đường thường ẩn dụ về sự hư ảo của cuộc đời.',
    examples: [
      { word: '夢境', transcription: 'Mộng cảnh', translation: 'cảnh trong mơ' },
      { word: '春夢', transcription: 'Xuân mộng', translation: 'giấc mộng xuân' },
      { word: '美夢', transcription: 'Mỹ mộng', translation: 'giấc mơ đẹp' },
    ],
    analyticalNotes:
      'Hợp thể từ 苜 (cỏ um tùm, mờ ảo) và 夕 (tối) + 冖 — ý chỉ trong đêm tối thấy cảnh mơ hồ.',
  },
  {
    character: '酒',
    sinoVietnamese: 'Tửu',
    pinyin: 'jiǔ',
    strokes: '10',
    radical: '酉 (dậu)',
    definition:
      'Rượu; chất men. Đề tài kinh điển của thơ ca Lý Bạch, Đỗ Phủ — biểu tượng cho phong lưu, sầu tư.',
    examples: [
      { word: '美酒', transcription: 'Mỹ tửu', translation: 'rượu ngon' },
      { word: '酒家', transcription: 'Tửu gia', translation: 'quán rượu' },
      { word: '飲酒', transcription: 'Ẩm tửu', translation: 'uống rượu' },
    ],
    analyticalNotes:
      'Bộ 氵 (thuỷ — nước) + 酉 (dậu — vò rượu). Hàm ý chất lỏng trong vò.',
  },
  {
    character: '茶',
    sinoVietnamese: 'Trà',
    pinyin: 'chá',
    strokes: '9',
    radical: '艸 (thảo)',
    definition:
      'Trà; cây trà; thức uống văn nhân ưa chuộng. Gắn với văn hoá thiền và thi nhân thanh tao.',
    examples: [
      { word: '茶道', transcription: 'Trà đạo', translation: 'nghệ thuật uống trà' },
      { word: '清茶', transcription: 'Thanh trà', translation: 'trà thanh đạm' },
      { word: '茶香', transcription: 'Trà hương', translation: 'hương trà' },
    ],
    analyticalNotes:
      'Bộ 艸 (cỏ) trên + 余 (dư — biểu âm).',
  },
  {
    character: '思',
    sinoVietnamese: 'Tư',
    pinyin: 'sī',
    strokes: '9',
    radical: '心 (tâm)',
    definition:
      'Suy nghĩ; nhớ; tư tưởng. Đề tài lớn trong thơ tương tư.',
    examples: [
      { word: '思想', transcription: 'Tư tưởng', translation: 'ý tưởng, suy nghĩ' },
      { word: '相思', transcription: 'Tương tư', translation: 'nhớ nhau' },
      { word: '思念', transcription: 'Tư niệm', translation: 'tưởng nhớ' },
    ],
    analyticalNotes:
      'Trên 田 (điền — biểu âm thượng cổ) + dưới 心 (tâm). Hàm ý suy nghĩ phát ra từ tâm.',
  },
  {
    character: '醉',
    sinoVietnamese: 'Tuý',
    pinyin: 'zuì',
    strokes: '15',
    radical: '酉 (dậu)',
    definition:
      'Say (rượu); mê đắm. Thường gắn với cảm hứng thi nhân.',
    examples: [
      { word: '醉酒', transcription: 'Tuý tửu', translation: 'say rượu' },
      { word: '陶醉', transcription: 'Đào tuý', translation: 'mê say, đắm chìm' },
      { word: '醉心', transcription: 'Tuý tâm', translation: 'mê đắm trong lòng' },
    ],
    analyticalNotes:
      'Bộ 酉 (vò rượu) + 卒 (tốt — biểu âm). Khi rượu đã cạn, người đã say.',
  },
  {
    character: '雲',
    sinoVietnamese: 'Vân',
    pinyin: 'yún',
    strokes: '12',
    radical: '雨 (vũ)',
    definition:
      'Mây; mây trời. Biểu tượng cho sự nhẹ nhàng, phiêu du, đôi khi là phiền muộn che khuất.',
    examples: [
      { word: '白雲', transcription: 'Bạch vân', translation: 'mây trắng' },
      { word: '雲海', transcription: 'Vân hải', translation: 'biển mây' },
      { word: '浮雲', transcription: 'Phù vân', translation: 'mây trôi, sự vô thường' },
    ],
    analyticalNotes:
      'Bộ 雨 (mưa) + 云 (vân — biểu âm và biểu nghĩa cổ).',
  },
  {
    character: '夜',
    sinoVietnamese: 'Dạ',
    pinyin: 'yè',
    strokes: '8',
    radical: '夕 (tịch)',
    definition:
      'Đêm; ban đêm. Bối cảnh thường gặp trong thơ Đường, gợi cô tịch, suy tư.',
    examples: [
      { word: '夜晚', transcription: 'Dạ vãn', translation: 'ban đêm' },
      { word: '深夜', transcription: 'Thâm dạ', translation: 'đêm khuya' },
      { word: '月夜', transcription: 'Nguyệt dạ', translation: 'đêm trăng' },
    ],
    analyticalNotes:
      'Hợp thể từ 亠 + 亻 + 夕 (tịch — chiều, tối). Ý: con người về đêm.',
  },
  {
    character: '書',
    sinoVietnamese: 'Thư',
    pinyin: 'shū',
    strokes: '10',
    radical: '曰 (viết)',
    definition:
      'Sách; thư từ; chữ viết. Trong văn hoá Nho gia là biểu tượng cho học vấn, tri thức.',
    examples: [
      { word: '書本', transcription: 'Thư bản', translation: 'sách' },
      { word: '讀書', transcription: 'Độc thư', translation: 'đọc sách, học hành' },
      { word: '家書', transcription: 'Gia thư', translation: 'thư nhà' },
    ],
    analyticalNotes:
      'Trên là 聿 (duật — bút), dưới là 曰 (viết — nói). Ý: dùng bút ghi lại lời nói.',
  },
  {
    character: '畫',
    sinoVietnamese: 'Hoạ',
    pinyin: 'huà',
    strokes: '12',
    radical: '田 (điền)',
    definition:
      'Tranh; vẽ tranh. Cùng với Thi (thơ) tạo nên cặp "Thi trung hữu hoạ".',
    examples: [
      { word: '畫家', transcription: 'Hoạ gia', translation: 'hoạ sĩ' },
      { word: '山水畫', transcription: 'Sơn thuỷ hoạ', translation: 'tranh sơn thuỷ' },
      { word: '詩畫', transcription: 'Thi hoạ', translation: 'thơ và hoạ' },
    ],
    analyticalNotes:
      'Trên 聿 (duật — bút), giữa 田 (điền — ruộng vuông), dưới 凵 — ý: dùng bút vẽ thành những ô khung.',
  },
  {
    character: '琴',
    sinoVietnamese: 'Cầm',
    pinyin: 'qín',
    strokes: '12',
    radical: '玉 (ngọc)',
    definition:
      'Đàn (đàn cổ cầm — 7 dây); nhạc cụ tao nhã của văn nhân. Một trong "Cầm, kì, thi, hoạ".',
    examples: [
      { word: '古琴', transcription: 'Cổ cầm', translation: 'đàn cổ cầm' },
      { word: '琴瑟', transcription: 'Cầm sắt', translation: 'đàn cầm và đàn sắt — vợ chồng hoà thuận' },
      { word: '彈琴', transcription: 'Đàn cầm', translation: 'gảy đàn' },
    ],
    analyticalNotes:
      'Trên là hai chữ 王 (vốn từ 玨 — ngọc) tượng trưng cho dây đàn, dưới là 今 (kim — biểu âm).',
  },
  {
    character: '道',
    sinoVietnamese: 'Đạo',
    pinyin: 'dào',
    strokes: '12',
    radical: '辵 (sước)',
    definition:
      'Con đường; đạo lý; chân lý. Phạm trù cốt lõi của Đạo gia và Nho gia.',
    examples: [
      { word: '大道', transcription: 'Đại đạo', translation: 'con đường lớn, chân lý' },
      { word: '道德', transcription: 'Đạo đức', translation: 'phẩm hạnh' },
      { word: '道家', transcription: 'Đạo gia', translation: 'trường phái triết Lão — Trang' },
    ],
    analyticalNotes:
      'Bộ 辶 (sước — đi) + 首 (thủ — đầu). Hàm ý: con đường mà cái đầu (suy tư) dẫn dắt.',
  },
];

/**
 * Tìm kiếm substring nhiều trường trên bộ dữ liệu offline.
 * Hỗ trợ tra theo: chữ Hán, phiên âm Hán-Việt, pinyin, hoặc nghĩa tiếng Việt.
 */
export function searchOffline(query: string): DictionaryEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return OFFLINE_ENTRIES.filter((entry) => {
    if (entry.character.includes(query.trim())) return true;
    if (entry.sinoVietnamese.toLowerCase().includes(q)) return true;
    if (entry.pinyin.toLowerCase().includes(q)) return true;
    if (entry.definition.toLowerCase().includes(q)) return true;
    if (
      entry.examples.some(
        (ex) =>
          ex.word.includes(query.trim()) ||
          ex.transcription.toLowerCase().includes(q) ||
          ex.translation.toLowerCase().includes(q),
      )
    ) {
      return true;
    }
    return false;
  });
}

/**
 * Trả về 8 entry phổ biến nhất từ bộ offline, dùng cho sidebar
 * trang Từ điển khi vừa mở.
 */
export function getPopularOffline(): DictionaryEntry[] {
  const popular = ['詩', '月', '心', '花', '春', '風', '雲', '夢'];
  return popular
    .map((c) => OFFLINE_ENTRIES.find((e) => e.character === c))
    .filter((e): e is DictionaryEntry => Boolean(e));
}
