import { Transform } from "class-transformer";
import { IsInt, IsPositive } from "class-validator";

export class PinIdDto {
    @IsInt()
    @IsPositive()
    @Transform(({ value }) => parseFloat(value))
    pinId: number;
}