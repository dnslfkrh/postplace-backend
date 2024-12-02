import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Pin } from "src/entities/Pin.entity";
import { BoundsProps } from "src/common/types/Props";
import { Repository } from "typeorm";

@Injectable()
export class PinRepository {
    constructor(
        @InjectRepository(Pin)
        private readonly pinRepository: Repository<Pin>,
    ) { }

    async createPin(pinData: Partial<Pin>): Promise<Pin> {
        const pinEntity = this.pinRepository.create(pinData);
        
        return await this.pinRepository.save(pinEntity);
    }

    async findPinsInBounds(bounds: BoundsProps): Promise<Pin[]> {
        const { northEast, southWest } = bounds;

        return await this.pinRepository
            .createQueryBuilder('pin')
            .where("pin.latitude BETWEEN :southLat AND :notrhLat", {
                notrhLat: northEast.latitude,
                southLat: southWest.latitude
            })
            .andWhere("pin.longitude BETWEEN :westLng AND :eastLng", {
                eastLng: northEast.longitude,
                westLng: southWest.longitude
            })
            .getMany();
    }
}