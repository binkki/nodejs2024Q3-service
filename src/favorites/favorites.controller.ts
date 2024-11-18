import {
  Controller,
  Get,
  Post,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  UnprocessableEntityException,
} from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { FavoriteType } from 'src/types/types';

@Controller('favs')
export class FavoritesController {
  constructor(private favoritesService: FavoritesService) {}

  @Get()
  async getAllFavorites() {
    return this.favoritesService.getAllFavorites();
  }

  @Post('album/:id')
  @HttpCode(HttpStatus.CREATED)
  async addAlbumToFavorites(@Param('id', ParseUUIDPipe) id: string) {
    await this.ensureItemExists(id, 'album');
    return this.favoritesService.addFavorite(id, 'album');
  }

  @Delete('album/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAlbumFromFavorites(@Param('id', ParseUUIDPipe) id: string) {
    await this.ensureItemInFavorites(id, 'album');
    return this.favoritesService.removeFavorite(id, 'album');
  }

  @Post('track/:id')
  @HttpCode(HttpStatus.CREATED)
  async addTrackToFavorites(@Param('id', ParseUUIDPipe) id: string) {
    await this.ensureItemExists(id, 'track');
    return this.favoritesService.addFavorite(id, 'track');
  }

  @Delete('track/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeTrackFromFavorites(@Param('id', ParseUUIDPipe) id: string) {
    await this.ensureItemInFavorites(id, 'track');
    return this.favoritesService.removeFavorite(id, 'track');
  }

  @Post('artist/:id')
  @HttpCode(HttpStatus.CREATED)
  async addArtistToFavorites(@Param('id', ParseUUIDPipe) id: string) {
    await this.ensureItemExists(id, 'artist');
    return this.favoritesService.addFavorite(id, 'artist');
  }

  @Delete('artist/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeArtistFromFavorites(@Param('id', ParseUUIDPipe) id: string) {
    await this.ensureItemInFavorites(id, 'artist');
    return this.favoritesService.removeFavorite(id, 'artist');
  }

  private async ensureItemExists(id: string, favoriteType: FavoriteType) {
    const exists = await this.favoritesService.doesItemExist(id, favoriteType);
    if (!exists) {
      throw new UnprocessableEntityException(
        `${favoriteType} with ID "${id}" does not exist.`,
      );
    }
  }

  private async ensureItemInFavorites(id: string, favoriteType: FavoriteType) {
    const inFavorites = await this.favoritesService.isItemInFavorites(
      id,
      favoriteType,
    );
    if (!inFavorites) {
      throw new NotFoundException(
        `${favoriteType} with ID "${id}" is not in your favorites.`,
      );
    }
  }
}