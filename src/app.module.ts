import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mysqlConfig } from './configs/mysql.config';

@Module({
  imports: [
    TypeOrmModule.forRoot(mysqlConfig),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
