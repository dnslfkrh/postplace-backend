import { Column, CreateDateColumn, Entity, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Pin } from "./Pin.entity";

@Entity('articles')
export class Article {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    content: string;

    @Column()
    userId: string; // 쿠키 속 사용자

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn({ nullable: true })
    updatedAt: Date;

    @Column({ default: false })
    isUpdated: boolean;

    @OneToOne(() => Pin, (pin) => pin.article)
    pin: Pin;
}
