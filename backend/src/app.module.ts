import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';

import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';

import { AuthModule } from './modules/auth/auth.module';
import { AuthorsModule } from './modules/authors/authors.module';
import { PoemsModule } from './modules/poems/poems.module';
import { TranslationsModule } from './modules/translations/translations.module';
import { CommentsModule } from './modules/comments/comments.module';
import { AnnotationsModule } from './modules/annotations/annotations.module';
import { ForumModule } from './modules/forum/forum.module';
import { BookmarksModule } from './modules/bookmarks/bookmarks.module';
import { CountriesModule } from './modules/countries/countries.module';
import { ErasModule } from './modules/eras/eras.module';
import { PoemCategoriesModule } from './modules/poem-categories/poem-categories.module';
import { ScraperModule } from './modules/scraper/scraper.module';

import { User } from './entities/user.entity';
import { Author } from './entities/author.entity';
import { Poem } from './entities/poem.entity';
import { PoemVersion } from './entities/poem-version.entity';
import { Translation } from './entities/translation.entity';
import { Annotation } from './entities/annotation.entity';
import { PoemAnnotation } from './entities/poem-annotation.entity';
import { Comment } from './entities/comment.entity';
import { ForumCategory } from './entities/forum-category.entity';
import { ForumTopic } from './entities/forum-topic.entity';
import { ForumPost } from './entities/forum-post.entity';
import { Bookmark } from './entities/bookmark.entity';
import { Country } from './entities/country.entity';
import { Era } from './entities/era.entity';
import { PoemCategory } from './entities/poem-category.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),

    ScheduleModule.forRoot(),

    ThrottlerModule.forRoot([{ ttl: 60000, limit: 100 }]),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('DB_HOST', 'localhost'),
        port: config.get<number>('DB_PORT', 5432),
        username: config.get<string>('DB_USERNAME', 'postgres'),
        password: config.get<string>('DB_PASSWORD', 'postgres'),
        database: config.get<string>('DB_NAME', 'thivien_db'),
        entities: [
          User, Author, Poem, PoemVersion, Translation,
          Annotation, PoemAnnotation, Comment,
          ForumCategory, ForumTopic, ForumPost,
          Bookmark, Country, Era, PoemCategory,
        ],
        synchronize: config.get<boolean>('DB_SYNCHRONIZE', false),
        logging: config.get<boolean>('DB_LOGGING', false),
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    AuthorsModule,
    PoemsModule,
    TranslationsModule,
    CommentsModule,
    AnnotationsModule,
    ForumModule,
    BookmarksModule,
    CountriesModule,
    ErasModule,
    PoemCategoriesModule,
    ScraperModule,
  ],
  providers: [
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
