import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/album.dto';
import { isValidAlbumDto, validateId } from '../utils/utils';
import { Album } from 'src/types/types';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllAlbums() {
    return await this.albumService.getAllAlbums();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getAlbumById(@Param('id') id: string) {
    validateId(id);
    const getResult = await this.albumService.getAlbumById(id);
    if (getResult.error) {
      throw getResult.error;
    }
    return getResult.album;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addAlbum(@Body() createAlbumDto: CreateAlbumDto) {
    if (!isValidAlbumDto(createAlbumDto)) {
      throw new BadRequestException('Wrong dto');
    }
    return await this.albumService.addAlbum(createAlbumDto);
  }

  @Put(':id')
  async updateAlbum(
    @Param('id') id: string,
    @Body() updateAlbumDto: UpdateAlbumDto,
  ) {
    validateId(id);
    if (!isValidAlbumDto(updateAlbumDto)) {
      throw new BadRequestException('Wrong dto');
    }
    const updateResult = await this.albumService.updateAlbum(id, updateAlbumDto);
    if (updateResult.error) {
      throw updateResult.error;
    }
    return updateResult.album;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAlbum(@Param('id') id: string) {
    validateId(id);
    const deleteResult = await this.albumService.deleteAlbum(id);
    if (deleteResult.error) {
      throw deleteResult.error;
    }
  }
}
