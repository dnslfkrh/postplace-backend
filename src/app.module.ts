import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mysqlConfig } from './configs/mysql.config';
import { MapService } from './map/map.service';
import { MapController } from './map/map.controller';
import { MapModule } from './map/map.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(mysqlConfig),
    AuthModule,
    MapModule,
  ],
  controllers: [
    AppController,
    MapController,
  ],
  providers: [
    AppService,
    MapService
  ],
})
export class AppModule { }