import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as yamljs from 'yamljs';

import { AppModule } from './app.module';

const port = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const document = yamljs.load('./doc/api.yaml');
  SwaggerModule.setup('doc', app, document);
  await app.listen(port);
}
bootstrap();
