import { NestFactory } from '@nestjs/core';
import { AppModule } from './v1/app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import * as process from 'process';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

const port = process.env.PORT ?? 3000;

async function bootstrap () {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '/static/'));
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  await app.listen(port, () => console.log(`Server started on 127.0.0.1:${port}`));
}
bootstrap();
