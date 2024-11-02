import { Controller, UseGuards } from '@nestjs/common';
import { MapService } from './map.service';

@Controller('map')
export class MapController {
    constructor(private readonly mapService: MapService) {}

    // @Post('post/article')
}
