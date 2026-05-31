import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedBaseData1748000000001 implements MigrationInterface {
  name = 'SeedBaseData1748000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ─── Seed Countries ────────────────────────────────────────────────────
    await queryRunner.query(`
      INSERT IGNORE INTO \`countries\` (\`name\`, \`iso_code\`) VALUES
        ('Việt Nam',        'VN'),
        ('Trung Quốc',      'CN'),
        ('Nhật Bản',        'JP'),
        ('Hàn Quốc',        'KR'),
        ('Pháp',            'FR'),
        ('Anh',             'GB'),
        ('Mỹ',              'US'),
        ('Nga',             'RU'),
        ('Đức',             'DE'),
        ('Ý',               'IT'),
        ('Tây Ban Nha',     'ES'),
        ('Ba Tư (Iran)',     'IR'),
        ('Ả Rập',           'SA'),
        ('Ấn Độ',           'IN'),
        ('Nhật Bản cổ đại', NULL)
    `);

    // ─── Seed Eras ────────────────────────────────────────────────────────
    await queryRunner.query(`
      INSERT IGNORE INTO \`eras\` (\`name\`, \`description\`, \`start_year\`, \`end_year\`) VALUES
        ('Hán triều',              'Thơ ca thời Hán - Trung Quốc',                     -206,  220),
        ('Đường triều',            'Hoàng kim của thơ Đường thi - thời kỳ đỉnh cao',    618,  907),
        ('Tống triều',             'Thơ từ Tống, thịnh hành thể Từ',                    960, 1279),
        ('Nguyên triều',           'Thơ ca thời Nguyên Mông',                          1271, 1368),
        ('Minh triều',             'Thơ ca thời Minh - Trung Quốc',                    1368, 1644),
        ('Thanh triều',            'Thơ ca thời Thanh - Trung Quốc',                   1644, 1912),
        ('Trung đại - Lý - Trần',  'Thơ ca Việt Nam thời Lý Trần',                    1010, 1400),
        ('Trung đại - Hậu Lê',     'Văn học chữ Hán và chữ Nôm thời Hậu Lê',          1428, 1788),
        ('Trung đại - Hậu Lê / Nguyễn', 'Giai đoạn chuyển tiếp Lê - Nguyễn',         1750, 1820),
        ('Triều Nguyễn',           'Thơ ca Việt Nam thời nhà Nguyễn',                  1802, 1945),
        ('Hiện đại (1900-1945)',    'Thơ Mới và văn học lãng mạn Việt Nam',             1900, 1945),
        ('Hiện đại (1945-1975)',    'Thơ ca cách mạng và kháng chiến',                  1945, 1975),
        ('Đương đại (sau 1975)',    'Thơ ca Việt Nam đương đại',                        1975, NULL),
        ('Cổ đại Nhật Bản',        'Thơ ca Nhật Bản cổ đại - Manyoshu, Haiku',          600, 1868),
        ('Trung cổ Châu Âu',       'Thơ ca châu Âu thời Trung cổ',                     500, 1500),
        ('Thế kỷ 19',              'Thơ ca lãng mạn và hiện thực thế kỷ XIX',          1800, 1900),
        ('Thế kỷ 20',              'Thơ ca hiện đại thế giới thế kỷ XX',               1900, 2000)
    `);

    // ─── Seed Poem Categories ─────────────────────────────────────────────
    await queryRunner.query(`
      INSERT IGNORE INTO \`poem_categories\` (\`name\`, \`slug\`, \`description\`) VALUES
        ('Thơ Đường luật',     'tho-duong-luat',      'Thơ theo thể thức thơ Đường - Tứ tuyệt, Bát cú'),
        ('Thơ Lục bát',        'tho-luc-bat',         'Thể thơ đặc trưng của Việt Nam - 6 âm tiết + 8 âm tiết'),
        ('Thơ Song thất lục bát', 'song-that-luc-bat', 'Thể thơ kết hợp câu 7 chữ và lục bát'),
        ('Tống từ',            'tong-tu',             'Thể từ khúc thịnh hành thời Tống'),
        ('Thơ Haikư',          'tho-haiku',           'Thơ cô đọng của Nhật Bản - 17 âm tiết'),
        ('Thơ tự do',          'tho-tu-do',           'Thơ không theo thể thức cố định'),
        ('Thơ năm chữ',        'tho-nam-chu',         'Thể thơ năm tiếng mỗi câu'),
        ('Thơ bảy chữ',        'tho-bay-chu',         'Thể thơ bảy tiếng mỗi câu'),
        ('Thơ tám chữ',        'tho-tam-chu',         'Thể thơ tám tiếng mỗi câu - phổ biến trong Thơ Mới'),
        ('Truyện thơ Nôm',     'truyen-tho-nom',      'Truyện thơ viết bằng chữ Nôm - Truyện Kiều, Lục Vân Tiên'),
        ('Phú',                'phu',                 'Thể văn vần cổ điển Trung Hoa và Việt Nam'),
        ('Từ',                 'tu',                  'Thể từ khúc - nhạc phủ từ'),
        ('Tản văn thơ',        'tan-van-tho',         'Thơ pha văn xuôi'),
        ('Ca dao - Tục ngữ',   'ca-dao-tuc-ngu',      'Thơ ca dân gian Việt Nam'),
        ('Vịnh sử',            'vinh-su',             'Thơ vịnh lịch sử và nhân vật lịch sử')
    `);

    // ─── Seed Forum Categories ────────────────────────────────────────────
    await queryRunner.query(`
      INSERT IGNORE INTO \`forum_categories\` (\`name\`, \`slug\`, \`description\`, \`display_order\`) VALUES
        ('Thảo luận Thơ ca',       'thao-luan-tho-ca',     'Bình luận, phân tích, cảm nhận về các bài thơ',             1),
        ('Dịch thuật & Phiên âm',  'dich-thuat-phien-am',  'Thảo luận về dịch thuật, đóng góp bản dịch mới',           2),
        ('Sáng tác Thơ Thành viên','sang-tac-thanh-vien',  'Chia sẻ và bình luận thơ tự sáng tác',                     3),
        ('Học thuật Văn học',      'hoc-thuat-van-hoc',    'Nghiên cứu, phân tích học thuật về thơ ca',                 4),
        ('Hỏi đáp Hán Việt',      'hoi-dap-han-viet',     'Giải nghĩa chữ Hán, điển cố, điển tích',                   5),
        ('Thông báo Hệ thống',     'thong-bao-he-thong',   'Các thông báo chính thức từ Ban quản trị',                  6)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM \`forum_categories\``);
    await queryRunner.query(`DELETE FROM \`poem_categories\``);
    await queryRunner.query(`DELETE FROM \`eras\``);
    await queryRunner.query(`DELETE FROM \`countries\``);
  }
}
