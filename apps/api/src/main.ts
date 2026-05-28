import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import * as express from 'express';
import { join } from 'path';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('AI CFO API')
    .setDescription('AI CFO Backend APIs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  app.use(
    '/swagger-assets',
    express.static(join(__dirname, '..', 'node_modules', 'swagger-ui-dist')),
  );

  SwaggerModule.setup('swagger', app, document, {
    jsonDocumentUrl: 'api/swagger-json',

    customCssUrl: '/swagger-assets/swagger-ui.css',
    customJs: [
      '/swagger-assets/swagger-ui-bundle.js',
      '/swagger-assets/swagger-ui-standalone-preset.js',
    ],

    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3001;

  await app.listen(port);

  Logger.log(`API: http://localhost:${port}/api`);
  Logger.log(`Swagger: http://localhost:${port}/swagger`);
}

bootstrap();
