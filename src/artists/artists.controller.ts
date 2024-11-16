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
import { ArtistService } from './artists.service';
import { CreateArtistDto, UpdateArtistDto } from './dto/artist.dto';
import { isValidArtistDto, validateId } from 'src/utils/utils';
import { Artist } from 'src/types/types';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllArtists() {
    return await this.artistService.getAllArtists();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getArtistById(@Param('id') id: string) {
    validateId(id);
    let artist: Artist;
    this.artistService.getArtistById(id).then(
      (data: Artist) => (artist = data),
      (error: Error) => {
        throw error;
      },
    );
    return artist;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addArtist(@Body() createArtistDto: CreateArtistDto) {
    if (!isValidArtistDto(createArtistDto)) {
      throw new BadRequestException('Wrong dto');
    }
    return await this.artistService.addArtist(createArtistDto);
  }

  @Put(':id')
  async updateArtist(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    validateId(id);
    if (!isValidArtistDto(updateArtistDto)) {
      throw new BadRequestException('Wrong dto');
    }
    let artist: Artist;
    this.artistService.updateArtist(id, updateArtistDto).then(
      (data: Artist) => (artist = data),
      (error: Error) => {
        throw error;
      },
    );
    return artist;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArtist(@Param('id') id: string) {
    validateId(id);
    this.artistService.deleteArtist(id).then(
      () => {
        return;
      },
      (error: Error) => {
        throw error;
      },
    );
  }
}
