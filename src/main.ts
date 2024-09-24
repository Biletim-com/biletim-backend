import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';
import { AppConfigService } from './configs/app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appConfigService = app.get<AppConfigService>(AppConfigService);

  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useLogger(app.get<Logger>(Logger));

  const docOptions = new DocumentBuilder()
    .setTitle('Biletim API')
    .setDescription('API Documentation')
    .setVersion('v1.0')
    .addCookieAuth('Authentication', {
      type: 'apiKey',
      name: 'Authentication',
    })
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, docOptions);
  SwaggerModule.setup('docs', app, swaggerDocument);

  await app.listen(appConfigService.port, '0.0.0.0');
}
bootstrap();
