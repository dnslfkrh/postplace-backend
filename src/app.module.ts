import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mysqlConfig } from './configs/mysql.config';
import { MapService } from './map/map.service';
import { MapController } from './map/map.controller';
import { MapModule } from './map/map.module';
import { TokenMiddleware } from './token/token.middleware';
import { UserService } from './user/user.service';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(mysqlConfig),
    AuthModule,
    MapModule,
    UserModule,
  ],
  controllers: [
    AppController,
    MapController,
  ],
  providers: [
    AppService,
    MapService,
    TokenMiddleware,
    UserService,
  ],
})

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TokenMiddleware)
      .exclude(
        { path: 'auth/(.*)', method: RequestMethod.ALL }
      )
      .forRoutes('*'); // 모든 경로 적용
  }
}