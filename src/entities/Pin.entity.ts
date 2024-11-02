import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Article } from "./Article.entity";

@Entity('pinpoints')
export class Pin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'float', precision: 10, scale: 8 }) // 위도 값의 범위를 고려한 타입
    latitude: number;

    @Column({ type: 'float', precision: 11, scale: 8 }) // 경도 값의 범위를 고려한 타입
    longitude: number;
}
