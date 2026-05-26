import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { join } from 'path';
import { AppModule } from './app/app.module';

async function bootstrap() {
  // Create App
  const app =
    await NestFactory.create<NestExpressApplication>(AppModule);

  // Global Prefix
  app.setGlobalPrefix('api');

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  // Serve Swagger Static Assets
  app.useStaticAssets(
  join(
    process.cwd(),
    'node_modules',
    'swagger-ui-dist',
  ),
  {
    prefix: '/swagger-assets/',
  },
);

  // Swagger Config
  const config = new DocumentBuilder()
    .setTitle('AI CFO API')
    .setDescription('AI CFO Backend APIs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  // Swagger Document
  const document = SwaggerModule.createDocument(app, config);

  // Swagger Setup
  SwaggerModule.setup('api/swagger', app, document, {
    jsonDocumentUrl: 'api/swagger-json',

    customCssUrl: '/swagger-assets/swagger-ui.css',

    customJs: [
      '/swagger-assets/swagger-ui-bundle.js',
      '/swagger-assets/swagger-ui-standalone-preset.js',
    ],

    swaggerOptions: {
      persistAuthorization: true,
    },

    customSiteTitle: 'AI CFO API Docs',
  });

  // Port
  const port = process.env.PORT || 3001;

  // Start Server
  await app.listen(port);

  // Logs
  Logger.log(
    `🚀 API running on http://localhost:${port}/api`,
  );

  Logger.log(
    `📘 Swagger running on http://localhost:${port}/api/swagger`,
  );
}

bootstrap();