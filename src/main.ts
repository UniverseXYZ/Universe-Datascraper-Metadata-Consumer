import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe, VersioningType } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const config = app.get<ConfigService>(ConfigService);
  const port = config.get('PORT') || 8080;
  app.setGlobalPrefix('v1');

  // Middlewares
  app.use(helmet());

  // Swagger Documentation
  const options = new DocumentBuilder()
    .setTitle('Universe API')
    .setDescription('Universe API Documentation')
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('v1/doc', app, document);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(port);
}
bootstrap();
