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

  app.enableCors({
    origin: function (origin, callback) {
      if (
        !origin ||
        appConfigService.corsWhitelist.split(',').includes('*') ||
        appConfigService.corsWhitelist.split(',').indexOf(origin) !== -1
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });
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
