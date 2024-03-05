import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { LoggerFactory } from './common/LoggerFactory';
import * as basicAuth from "express-basic-auth";
import { ConfigModule } from '@nestjs/config';
ConfigModule.forRoot()

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: LoggerFactory('MyApp'),
  });


  const config = new DocumentBuilder()
    .setTitle('Product example')
    .setDescription('The Product API description')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  app.useGlobalPipes(new ValidationPipe());

  // app.use(logger);  global middleware
  await app.listen(3000);
}
bootstrap();  