import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { validateId } from 'src/utils/utils';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllFavorites() {
    return await this.favoritesService.getAllFavorites();
  }

  @Post('track/:id')
  async addTrack(@Param('id') id: string) {
    validateId(id);
    return await this.favoritesService.addTrackToFavorites(id);
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrack(@Param('id') id: string) {
    validateId(id);
    return await this.favoritesService.deleteTrackFromFavorites(id);
  }

  @Post('album/:id')
  async addAlbum(@Param('id') id: string) {
    validateId(id);
    return await this.favoritesService.addAlbumToFavorites(id);
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbum(@Param('id') id: string) {
    return await this.favoritesService.deleteAlbumFromFavorites(id);
  }

  @Post('artist/:id')
  async addArtist(@Param('id') id: string) {
    validateId(id);
    return await this.favoritesService.addArtistToFavorites(id);
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtist(@Param('id') id: string) {
    validateId(id);
    return await this.favoritesService.deleteArtistFromFavorites(id);
  }
}
