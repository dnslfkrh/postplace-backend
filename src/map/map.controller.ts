import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { MapService } from './map.service';
import { NewArticleDto } from 'src/dto/article.dto';
import { Request, Response } from 'express';

@Controller('map')
export class MapController {
    constructor(private readonly mapService: MapService) { }

    @Post('post/article')
    async postArticle(
        @Req() req: Request,
        @Body() articleData: NewArticleDto
    ) {
        const user = req['user'];

        return await this.mapService.createArticle(user, articleData);
    }

    @Get('get/pins')
    async getPins() {
        return await this.mapService.readPins();
    }
}