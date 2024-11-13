import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FRONTEND_URL, PORT } from './configs/env.config';
import * as cookieParser from 'cookie-parser';
import { UserExceptionFilter } from './common/filters/globalException.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: FRONTEND_URL,
    credentials: true,
  });

  app.use(cookieParser());

  app.useGlobalFilters(
    new UserExceptionFilter(),
  );

  await app.listen(PORT);
}

bootstrap();