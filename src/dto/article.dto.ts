import { Type } from "class-transformer";
import { IsNotEmpty, IsString, ValidateNested } from "class-validator";
import { pinPositionDto } from "./pin.dto";

export class NewArticleDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsString()
    @IsNotEmpty()
    content: string;

    @ValidateNested()
    @Type(() => pinPositionDto)
    position: pinPositionDto;
};