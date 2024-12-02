import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Pin } from "./Pin.entity";

@Entity('articles')
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    pinId: number;

    @Column()
    userId: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({ nullable: true })
    updatedAt: Date;

    @Column({ default: false })
    isUpdated: boolean;
}
