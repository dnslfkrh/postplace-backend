import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewArticleDto } from 'src/modules/map/dto/newPin.dto';
import { Pin } from 'src/entities/Pin.entity';
import { PinRepository } from 'src/repositories/pin.repository';
import { BoundsProps } from 'src/common/types/Props';
import { UserRepository } from 'src/repositories/user.repository';
import { PinIdDto } from './dto/pinIdQuery.dto';
import { PinWithUserDto } from './dto/returnPinData.dto';

@Injectable()
export class MapService {
    constructor(
        private pinRepository: PinRepository,
        private userRepository: UserRepository
    ) { }

    async createArticle(user: number, articleData: NewArticleDto) {
        return await this.pinRepository.createPin({
            userId: user,
            latitude: articleData.position.latitude,
            longitude: articleData.position.longitude,
            title: articleData.title,
            content: articleData.content
        });
    }

    async getPins(bounds: BoundsProps): Promise<Pin[]> {
        return await this.pinRepository.findPinsInBounds(bounds);
    }

    async findPinById(id: number): Promise<PinWithUserDto> {
        const pin = await this.pinRepository.findPinById(id);

        const user = await this.userRepository.findUserNameById(pin.userId);

        return {...pin, userName: user.name}
    }
}
