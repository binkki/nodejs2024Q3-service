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
    const getResult = await this.artistService.getArtistById(id);
    if (getResult.error) {
      throw getResult.error;
    }
    return getResult.artist;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addArtist(@Body() createArtistDto: CreateArtistDto) {
    if (!isValidArtistDto(createArtistDto, true)) {
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
    if (!isValidArtistDto(updateArtistDto, false)) {
      throw new BadRequestException('Wrong dto');
    }
    const updateResult = await this.artistService.updateArtist(
      id,
      updateArtistDto,
    );
    if (updateResult.error) {
      throw updateResult.error;
    }
    return updateResult.artist;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteArtist(@Param('id') id: string) {
    validateId(id);
    const deleteResult = await this.artistService.deleteArtist(id);
    if (deleteResult.error) {
      throw deleteResult.error;
    }
  }
}
