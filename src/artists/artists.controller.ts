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
} from '@nestjs/common';
import { ArtistService } from './artists.service';
import { CreateArtistDto, UpdateArtistDto } from './dto/artist.dto';

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
    return await this.artistService.getArtistById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addArtist(@Body() createArtistDto: CreateArtistDto) {
    return this.artistService.addArtist(createArtistDto);
  }

  @Put(':id')
  async updateArtist(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    return await this.artistService.updateArtist(id, updateArtistDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArtist(@Param('id') id: string) {
    await this.artistService.deleteArtist(id);
  }
}
