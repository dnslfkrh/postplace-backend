import { IsNotEmpty, IsNumber } from "class-validator";

export class pinPositionDto {
    @IsNumber()
    @IsNotEmpty()
    lat: number;

    @IsNumber()
    @IsNotEmpty()
    lng: number;
}