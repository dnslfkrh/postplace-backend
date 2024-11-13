import { Body, Controller, Get, Post, Query, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { MapService } from './map.service';
import { NewArticleDto } from 'src/modules/map/dto/article.dto';
import { Request, Response } from 'express';
import { BoundsProps } from 'src/common/types/Props';
import { BoundsQueryDto } from './dto/BoundsQuery.dto';

@Controller('map')
export class MapController {
    constructor(private readonly mapService: MapService) { }

    @Post('post/article')
    async postArticle(@Req() req: Request, @Body() articleData: NewArticleDto) {
        const user = req['user'];
        return await this.mapService.createArticle(user, articleData);
    }

    @Get('get/pins')
    @UsePipes(new ValidationPipe({ transform: true }))
    async getPins(@Query() boundsDto: BoundsQueryDto) {
        const bounds: BoundsProps = {
            northEast: { latitude: boundsDto.neLat, longitude: boundsDto.neLng },
            southWest: { latitude: boundsDto.swLat, longitude: boundsDto.swLng }
        };
        return await this.mapService.getPins(bounds);
    }
}