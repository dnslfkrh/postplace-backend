import { IsNumber } from "class-validator";

export class BoundsQueryDto {
    @IsNumber()
    neLat: number;

    @IsNumber()
    neLng: number;

    @IsNumber()
    swLat: number;

    @IsNumber()
    swLng: number;
}
