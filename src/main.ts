import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AppConfigService } from './configs/app';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appConfigService = app.get<AppConfigService>(AppConfigService);

  app.useGlobalPipes(new ValidationPipe());

  const docOptions = new DocumentBuilder()
    .setTitle('Biletim API')
    .setDescription('API Documentation')
    .setVersion('v1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, docOptions);
  SwaggerModule.setup('api', app, document);

  app.enableCors();

  await app.listen(appConfigService.port, '0.0.0.0');
}
bootstrap();
