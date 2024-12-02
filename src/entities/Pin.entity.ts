import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('pinpoints')
export class Pin {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'float', precision: 10, scale: 8 })
    latitude: number;

    @Column({ type: 'float', precision: 11, scale: 8 })
    longitude: number;

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
