import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { ApiBody, ApiProperty, ApiTags } from '@nestjs/swagger';
import { Album } from './album.entity';

export class RateDto {
  @ApiProperty()
  rating: number;
}

@Controller('albums')
@ApiTags('albums')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  findAll(): Promise<Album[]> {
    return this.albumService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number): Promise<Album | null> {
    return this.albumService.findOne(id);
  }

  @Put(':id')
  @ApiBody({ type: Album })
  update(
    @Param('id') id: number,
    @Body() albumData: Album,
  ): Promise<Album | null> {
    delete albumData.cover_base64;
    return this.albumService.update(id, albumData);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.albumService.remove(id);
  }

  @Post(':id/rate')
  @ApiBody({ type: RateDto })
  rate(
    @Param('id') id: number,
    @Body() ratingData: { rating: number },
  ): Promise<Album | null> {
    return this.albumService.rate(id, ratingData.rating);
  }

  @Post()
  @ApiBody({ type: Album })
  create(@Body() albumData: Album): Promise<Album> {
    return this.albumService.create(albumData);
  }
}
