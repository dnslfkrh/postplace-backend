import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mysqlConfig } from './configs/mysql.config';
import { MapService } from './modules/map/map.service';
import { MapController } from './modules/map/map.controller';
import { MapModule } from './modules/map/map.module';
import { TokenMiddleware } from './common/middlewares/token.middleware';
import { UserService } from './modules/user/user.service';
import { UserModule } from './modules/user/user.module';

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