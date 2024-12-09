import { Body, Controller, Get, Post, Query, Req, UsePipes, ValidationPipe } from '@nestjs/common';
import { MapService } from './map.service';
import { NewArticleDto } from 'src/modules/map/dto/newPin.dto';
import { Request } from 'express';
import { BoundsProps } from 'src/common/types/Props';
import { BoundsQueryDto } from './dto/boundsQuery.dto';
import { PinIdDto } from './dto/pinIdQuery.dto';

@Controller('map')
export class MapController {
    constructor(
        private readonly mapService: MapService
    ) { }

    @Post('post/article')
    async postArticle(@Req() req: Request, @Body() articleData: NewArticleDto) {
        const user = req['user'];

        return await this.mapService.createArticle(user, articleData);
    }

    @Get('get/pins')
    @UsePipes(new ValidationPipe({ transform: true }))
    async getPins(@Query() query: BoundsQueryDto) {
        const bounds: BoundsProps = {
            northEast: { latitude: query.neLat, longitude: query.neLng },
            southWest: { latitude: query.swLat, longitude: query.swLng }
        };

        return await this.mapService.getPins(bounds);
    }

    @Get('get/pin')
    @UsePipes(new ValidationPipe({ transform: true }))
    async getPin(@Query() query: PinIdDto) {
        return await this.mapService.findPinById(query.pinId);
    }
}