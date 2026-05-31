import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe, ClassSerializerInterceptor } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.enableCors({ origin: '*', methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS' });
  app.setGlobalPrefix(process.env.API_PREFIX || 'v1');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const swaggerConfig = new DocumentBuilder()
    .setTitle('Thi Viện API')
    .setDescription('Backend API cho hệ thống thư viện thơ ca Thi Viện (Modern Clone)')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Xác thực & Quản lý tài khoản')
    .addTag('Authors', 'Quản lý tác giả / dịch giả')
    .addTag('Poems', 'Quản lý bài thơ')
    .addTag('Translations', 'Quản lý bản dịch')
    .addTag('Comments', 'Hệ thống bình luận')
    .addTag('Annotations & Dictionary', 'Từ điển Hán Việt & Điển tích')
    .addTag('Forum', 'Diễn đàn văn học')
    .addTag('Bookmarks', 'Tủ sách yêu thích')
    .addTag('Countries', 'Quản lý quốc gia')
    .addTag('Eras', 'Quản lý thời kỳ / triều đại')
    .addTag('Poem Categories', 'Quản lý thể loại thơ')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: { persistAuthorization: true },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`\n🚀 Thi Viện API đang chạy tại: http://localhost:${port}/v1`);
  console.log(`📚 Swagger docs: http://localhost:${port}/docs\n`);
}

bootstrap();
