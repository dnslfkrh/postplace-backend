import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { MapService } from './map.service';
import { AccessTokenGuard } from 'src/auth/guard/accessToken';
import { NewArticleDto } from 'src/dto/article.dto';
import { Request } from 'express';

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
}