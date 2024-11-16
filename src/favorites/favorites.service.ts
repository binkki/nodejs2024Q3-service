import {
  Injectable,
  Inject,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Album, Artist, FavoritesResponse, Track } from 'src/types/types';
import { validateId } from '../utils/utils';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class FavoritesService {
  constructor(private db: DatabaseService) {}

  async getAllFavorites() {}

  async addTrackToFavorites(trackId: string) {}

  async deleteTrackFromFavorites(trackId: string) {}

  async addAlbumToFavorites(albumId: string) {}

  async deleteAlbumFromFavorites(albumId: string) {}

  async addArtistToFavorites(artistId: string) {}

  async deleteArtistFromFavorites(artistId: string) {}
}
