import { ApiProperty } from '@nestjs/swagger';

export class DictionaryExampleDto {
  @ApiProperty({ example: '詩歌', description: 'Cụm từ Hán' })
  word!: string;

  @ApiProperty({ example: 'Thi ca', description: 'Phiên âm Hán-Việt' })
  transcription!: string;

  @ApiProperty({ example: 'thơ và nhạc', description: 'Dịch nghĩa tiếng Việt' })
  translation!: string;
}

export class DictionaryEntry {
  @ApiProperty({ example: '詩', description: 'Chữ Hán' })
  character!: string;

  @ApiProperty({ example: 'Thi', description: 'Phiên âm Hán-Việt' })
  sinoVietnamese!: string;

  @ApiProperty({ example: 'shī', description: 'Bính âm (Pinyin)' })
  pinyin!: string;

  @ApiProperty({ example: '13', description: 'Số nét' })
  strokes!: string;

  @ApiProperty({ example: '言 (ngôn)', description: 'Bộ thủ' })
  radical!: string;

  @ApiProperty({ description: 'Nghĩa tiếng Việt' })
  definition!: string;

  @ApiProperty({ type: [DictionaryExampleDto], description: 'Ví dụ minh hoạ' })
  examples!: DictionaryExampleDto[];

  @ApiProperty({ required: false, description: 'Chiết tự / ghi chú từ nguyên' })
  analyticalNotes?: string;
}
