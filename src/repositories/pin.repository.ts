import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Pin } from "src/entities/Pin.entity";
import { BoundsProps } from "src/common/types/Props";
import { Between, Repository } from "typeorm";

@Injectable()
export class PinRepository {
    constructor(
        @InjectRepository(Pin)
        private readonly pinRepository: Repository<Pin>,
    ) { }

    async createPin(pinData: Partial<Pin>): Promise<Pin> { // Partial은 일부만 만족 가능
        const pinEntity = this.pinRepository.create(pinData);

        return await this.pinRepository.save(pinEntity);
    }

    async findPinsInBounds(bounds: BoundsProps): Promise<Pin[]> {
        return await this.pinRepository.find({
            where: {
                latitude: Between(bounds.southWest.latitude, bounds.northEast.latitude),
                longitude: Between(bounds.southWest.longitude, bounds.northEast.longitude),
            },
            select: ['id', 'latitude', 'longitude', 'title']
        });
    }

    // 개별적으로 게시물만 보여줄 때
    async findPinById(id: number): Promise<Pin | null> {
        const pin = await this.pinRepository.findOne({
            where: { id },
            select: ['userId', 'title', 'content', 'createdAt', 'isUpdated']
        });
    
        if (!pin) {
            return null;
        }
    
        // 수정된 게시물이면 수정 시간까지 보내줌
        if (pin.isUpdated) {
            const updatedPin = await this.pinRepository.findOne({
                where: { id },
                select: ['updatedAt']
            });
    
            if (updatedPin && updatedPin.updatedAt) {
                pin.updatedAt = updatedPin.updatedAt;
            }
        }
    
        return pin;
    }
}