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
        console.log('articleData:', articleData); // 로그 추가
        const pin = await this.pinRepository.createPin({
            latitude: articleData.position.latitude, // 올바른 위치 데이터 사용
            longitude: articleData.position.longitude, // 올바른 위치 데이터 사용
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
