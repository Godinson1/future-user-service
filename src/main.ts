import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RmqService, AUTH_SERVICE } from 'future-connectors';
import { RmqOptions } from '@nestjs/microservices';
import { json, urlencoded } from 'express';
import helmet from 'helmet';

import { AppModule } from './app.module';
import { createLogger } from './middlewares/logger';

interface ICorsOption {
  origin: (string | RegExp)[];
  methods: string;
  preflightContinue: boolean;
  optionsSuccessStatus: number;
  credentials: boolean;
}

const corsOption: ICorsOption = {
  origin: ['http://localhost:3000'],
  methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204,
  credentials: true,
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(corsOption);
  app.use(helmet());

  app.useLogger(createLogger());
  app.useGlobalPipes(new ValidationPipe());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ limit: '50mb', extended: true }));

  const rmqService = app.get<RmqService>(RmqService);
  app.connectMicroservice<RmqOptions>(rmqService.getOptions(AUTH_SERVICE, true));
  await app.startAllMicroservices();
  const configService = app.get(ConfigService);
  await app.listen(configService.get('PORT'));
}
bootstrap();
