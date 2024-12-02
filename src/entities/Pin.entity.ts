import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('pinpoints')
export class Pin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'float', precision: 10, scale: 8 })
    latitude: number;

    @Column({ type: 'float', precision: 11, scale: 8 })
    longitude: number;
}
