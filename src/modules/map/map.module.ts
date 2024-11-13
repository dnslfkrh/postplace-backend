import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapController } from './map.controller';
import { MapService } from './map.service';
import { ArticleRepository } from 'src/repositories/article.repository';
import { PinRepository } from 'src/repositories/pin.repository';
import { Article } from 'src/entities/Article.entity';
import { Pin } from 'src/entities/Pin.entity';
import { User } from 'src/entities/User.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Article, Pin, User]),
    ],
    providers: [
        MapService,
        ArticleRepository,
        PinRepository,
    ],
    controllers: [MapController],
    exports: [MapService, PinRepository, ArticleRepository]
})

export class MapModule { }
