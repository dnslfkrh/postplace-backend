import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Pin } from "src/entities/Pin.entity";
import { Repository } from "typeorm";

@Injectable()
export class PinRepository {
    constructor(
        @InjectRepository(Pin)
        private readonly pinRepository: Repository<Pin>,
    ) { }

    async createPin(pinData: Partial<Pin>): Promise<Pin> {
        const pin = this.pinRepository.create(pinData);
        return await this.pinRepository.save(pin);
    };

    async findPinsInBounds(bounds: {
        northEast: { latitude: number, longitude: number },
        southWest: { latitude: number, longitude: number }
    }
    ) {
        const { northEast, southWest } = bounds;

        const pins = await this.pinRepository
            .createQueryBuilder('pin')
            .where("pin.latitude BETWEEN :southLat AND :notrhLat", {
                southLat: southWest.latitude,
                notrhLat: northEast.latitude
            })
            .andWhere("pin.longitude BETWEEN :westLng AND :eastLng", {
                westLng: southWest.longitude,
                eastLng: northEast.longitude
            })
            .getMany();

        console.log(pins);
        return pins;
    };
}