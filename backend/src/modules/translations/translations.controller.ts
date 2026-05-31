import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { TranslationsService } from './translations.service';
import { CreateTranslationDto, UpdateTranslationDto } from './dto/create-translation.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../../entities/user.entity';

@ApiTags('Translations')
@ApiBearerAuth()
@Controller()
export class TranslationsController {
  constructor(private readonly translationsService: TranslationsService) {}

  @Post('poems/:poem_id/versions/:version_id/translations')
  @ApiOperation({ summary: 'Đóng góp bản dịch mới' })
  create(
    @Param('poem_id') poemId: string,
    @Param('version_id') versionId: string,
    @Body() dto: CreateTranslationDto,
    @CurrentUser() user: User,
  ) {
    return this.translationsService.create(+poemId, +versionId, dto, user);
  }

  @Put('translations/:id')
  @ApiOperation({ summary: 'Sửa bản dịch' })
  update(@Param('id') id: string, @Body() dto: UpdateTranslationDto, @CurrentUser() user: User) {
    return this.translationsService.update(+id, dto, user);
  }

  @Delete('translations/:id')
  @ApiOperation({ summary: 'Xóa bản dịch' })
  remove(@Param('id') id: string, @CurrentUser() user: User) {
    return this.translationsService.remove(+id, user);
  }

  @Post('translations/:id/favorite')
  @ApiOperation({ summary: 'Đặt làm bản dịch yêu thích (Admin/Mod)' })
  setFavorite(@Param('id') id: string, @CurrentUser() user: User) {
    return this.translationsService.setFavorite(+id, user);
  }
}
