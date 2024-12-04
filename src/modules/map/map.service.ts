import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewArticleDto } from 'src/modules/map/dto/article.dto';
import { Pin } from 'src/entities/Pin.entity';
import { PinRepository } from 'src/repositories/pin.repository';
import { BoundsProps } from 'src/common/types/Props';

@Injectable()
export class MapService {
    constructor(
        private pinRepository: PinRepository,
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
}
