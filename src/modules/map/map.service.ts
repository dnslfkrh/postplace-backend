import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewArticleDto } from 'src/modules/map/dto/article.dto';
import { Pin } from 'src/entities/Pin.entity';
import { ArticleRepository } from 'src/repositories/article.repository';
import { PinRepository } from 'src/repositories/pin.repository';
import { BoundsProps } from 'src/common/types/Props';

@Injectable()
export class MapService {
    constructor(
        private pinRepository: PinRepository,
        private articleRepository: ArticleRepository,
    ) { }

    async createArticle(user: number, articleData: NewArticleDto) {
        const pin = await this.pinRepository.createPin({
            latitude: articleData.position.latitude,
            longitude: articleData.position.longitude,
        });

        return await this.articleRepository.createArticle(
            user,
            articleData.title,
            articleData.content,
            pin.id
        );
    }

    async getPins(bounds: BoundsProps): Promise<Pin[]> {
        return await this.pinRepository.findPinsInBounds(bounds);
    }
}
