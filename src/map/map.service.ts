import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { NewArticleDto } from 'src/dto/article.dto';
import { ArticleRepository } from 'src/repositories/article.repository';
import { PinRepository } from 'src/repositories/pin.repository';

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
    };

    async getPins(bounds: {
        northEast: { latitude: number, longitude: number },
        southWest: { latitude: number, longitude: number }
    }) {
        return await this.pinRepository.findPinsInBounds(bounds);
    };
}
