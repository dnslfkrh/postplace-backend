import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Article } from "./Article.entity";

@Entity('pinpoints')
export class Pin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    latitude: number;

    @Column()
    longitude: number;

    @OneToOne(() => Article, (article) => article.pin)
    article: Article;
}
