import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Article } from "src/entities/Article.entity";
import { Repository } from "typeorm";

@Injectable()
export class ArticleRepository {
    constructor(
        @InjectRepository(Article)
        private readonly articleRepository: Repository<Article>,
    ) { }

    async createArticle(userId: number, title: string, content: string, pinId: number): Promise<Article> {
        const article = this.articleRepository.create({
            pinId: pinId,
            userId: userId,
            title: title,
            content: content,
        });
        
        return await this.articleRepository.save(article);
    }
}