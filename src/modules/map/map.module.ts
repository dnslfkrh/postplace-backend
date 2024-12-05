import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapController } from './map.controller';
import { MapService } from './map.service';
import { PinRepository } from 'src/repositories/pin.repository';
import { Pin } from 'src/entities/Pin.entity';
import { User } from 'src/entities/User.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Pin, User]),
    ],
    providers: [
        MapService,
        PinRepository,
    ],
    controllers: [
        MapController
    ],
    exports: [
        MapService,
        PinRepository,
    ]
})

export class MapModule { }
