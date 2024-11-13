import { IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class BoundsQueryDto {
    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    neLat: number;

    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    neLng: number;

    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    swLat: number;

    @IsNumber()
    @Transform(({ value }) => parseFloat(value))
    swLng: number;
}