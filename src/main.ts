import { NestFactory, Reflector } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import * as yamljs from 'yamljs';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './auth/auth.guard';

import { AppModule } from './app.module';

const port = process.env.PORT || 4000;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const jwtService = app.get(JwtService);
  const reflector = app.get(Reflector);
  app.useGlobalGuards(new AuthGuard(jwtService, reflector));

  const document = yamljs.load('./doc/api.yaml');
  SwaggerModule.setup('doc', app, document);
  await app.listen(port);
}
bootstrap();
