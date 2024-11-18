import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { FavoritesResponse, FavoriteType } from 'src/types/types';

@Injectable()
export class FavoritesService {
  constructor(private db: DatabaseService) {}

  async getAllFavorites() {
    const [tracks, artists, albums] = await Promise.all([
      this.getFavorites('track'),
      this.getFavorites('artist'),
      this.getFavorites('album'),
    ]);

    return { tracks, artists, albums };
  }

  private async getFavorites(favoriteType: FavoriteType) {
    switch (favoriteType) {
      case 'track':
        return (
          await this.db.favoriteTrack.findMany({
            include: { track: true },
          })
        ).map((v) => v.track);

      case 'artist':
        return (
          await this.db.favoriteArtist.findMany({
            include: { artist: true },
          })
        ).map((v) => v.artist);

      case 'album':
        return (
          await this.db.favoriteAlbum.findMany({
            include: { album: true },
          })
        ).map((v) => v.album);

      default:
        return [];
    }
  }

  async doesItemExist(id: string, favoriteType: FavoriteType) {
    return Boolean(await this.findItemById(id, favoriteType));
  }

  private async findItemById(id: string, favoriteType: FavoriteType) {
    switch (favoriteType) {
      case 'artist':
        return this.db.artist.findUnique({ where: { id } });
      case 'album':
        return this.db.album.findUnique({ where: { id } });
      case 'track':
        return this.db.track.findUnique({ where: { id } });
      default:
        return null;
    }
  }

  async isItemInFavorites(id: string, favoriteType: FavoriteType) {
    switch (favoriteType) {
      case 'artist':
        return this.db.favoriteArtist.findUnique({
          where: { artistId: id },
        });
      case 'album':
        return this.db.favoriteAlbum.findUnique({
          where: { albumId: id },
        });
      case 'track':
        return this.db.favoriteTrack.findUnique({
          where: { trackId: id },
        });
      default:
        return null;
    }
  }

  async addFavorite(id: string, favoriteType: FavoriteType) {
    const existingFavorite = await this.isItemInFavorites(id, favoriteType);
    if (existingFavorite) return existingFavorite;

    return this.addToFavorites(id, favoriteType);
  }

  private async addToFavorites(id: string, favoriteType: FavoriteType) {
    switch (favoriteType) {
      case 'artist':
        return this.db.favoriteArtist.create({
          data: { artistId: id },
        });
      case 'album':
        return this.db.favoriteAlbum.create({
          data: { albumId: id },
        });
      case 'track':
        return this.db.favoriteTrack.create({
          data: { trackId: id },
        });
      default:
        throw new Error(`Unsupported favorite type: ${favoriteType}`);
    }
  }

  async removeFavorite(id: string, favoriteType: FavoriteType) {
    const deleteMethod = this.getDeleteMethod(favoriteType);
    if (!deleteMethod)
      throw new Error(`Unsupported favorite type: ${favoriteType}`);

    await deleteMethod(id);
  }

  private getDeleteMethod(favoriteType: FavoriteType) {
    switch (favoriteType) {
      case 'artist':
        return (id: string) =>
          this.db.favoriteArtist.delete({ where: { artistId: id } });
      case 'album':
        return (id: string) =>
          this.db.favoriteAlbum.delete({ where: { albumId: id } });
      case 'track':
        return (id: string) =>
          this.db.favoriteTrack.delete({ where: { trackId: id } });
      default:
        return null;
    }
  }
}