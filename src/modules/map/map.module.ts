import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MapController } from './map.controller';
import { MapService } from './map.service';
import { PinRepository } from 'src/repositories/pin.repository';
import { Pin } from 'src/entities/Pin.entity';
import { User } from 'src/entities/User.entity';
import { UserRepository } from 'src/repositories/user.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([Pin, User]),
    ],
    providers: [
        MapService,
        PinRepository,
        UserRepository,
    ],
    controllers: [
        MapController
    ],
    exports: [
        MapService,
        PinRepository,
        UserRepository,
    ]
})

export class MapModule { }
