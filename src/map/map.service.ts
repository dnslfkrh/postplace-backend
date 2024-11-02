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
        console.log('articleData:', articleData);
        const pin = await this.pinRepository.createPin({
            latitude: articleData.position.latitude,
            longitude: articleData.position.longitude,
        });

        console.log('Creating article with:', {
            user,
            title: articleData.title,
            content: articleData.content,
            pinId: pin.id
        });

        return await this.articleRepository.createArticle(
            user,
            articleData.title,
            articleData.content,
            pin.id
        );
    }
}
