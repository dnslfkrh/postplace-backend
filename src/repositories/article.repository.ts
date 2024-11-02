import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { NewArticleDto } from "src/dto/article.dto";
import { Article } from "src/entities/Article.entity";
import { Repository } from "typeorm";

@Injectable()
export class ArticleRepository {
    constructor(
        @InjectRepository(Article)
        private readonly articleRepository: Repository<Article>,
    ) { }

    async createArticle(userId: number, title: string, content: string, pinId: number): Promise<Article> {
        console.log("아티클 생성: ", { userId, title, content, pinId });
        const article = this.articleRepository.create({
            pinId: pinId,
            userId: userId,
            title: title,
            content: content,
        });
        console.log('저장할 아티클: ', article);
        return await this.articleRepository.save(article);
    }
}