import {
  Injectable,
  Inject,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Album, Artist, DB, FavoritesResponse, Track } from 'src/types/types';
import { validateId } from '../utils/utils';

@Injectable()
export class FavoritesService {
  constructor(@Inject('DB_CONNECTION') private readonly db: DB) {}

  getAllFavorites(): FavoritesResponse {
    return {
      albums: this.db.favorites.albums
        .slice()
        .map((albumId: string) =>
          this.db.albums.find((x: Album) => x.id === albumId),
        )
        .filter((e) => e != null),
      artists: this.db.favorites.artists
        .slice()
        .map((artistId: string) =>
          this.db.artists.find((x: Artist) => x.id === artistId),
        )
        .filter((e) => e != null),
      tracks: this.db.favorites.tracks
        .slice()
        .map((trackId: string) =>
          this.db.tracks.find((x: Track) => x.id === trackId),
        )
        .filter((e) => e != null),
    };
  }

  getTrackIndexInFavourites(trackId: string): number {
    validateId(trackId);
    return this.db.favorites.tracks.indexOf(trackId);
  }

  addTrackToFavorites(trackId: string) {
    validateId(trackId);
    if (
      this.db.tracks.filter((track: Track) => track.id === trackId).length === 0
    ) {
      throw new UnprocessableEntityException("Track doesn't exist");
    }
    if (this.getTrackIndexInFavourites(trackId) === -1) {
      this.db.favorites.tracks.push(trackId);
    }
  }

  async deleteTrackFromFavorites(trackId: string) {
    validateId(trackId);
    const trackIndex = this.getTrackIndexInFavourites(trackId);
    if (trackIndex === -1) {
      throw new UnprocessableEntityException("Track doesn't exist");
    }
    this.db.favorites.tracks.splice(trackIndex, 1);
  }

  getAlbumIndexInFavourites(albumId: string): number {
    validateId(albumId);
    return this.db.favorites.albums.indexOf(albumId);
  }

  addAlbumToFavorites(albumId: string) {
    validateId(albumId);
    const albumIndex = this.db.albums.findIndex(
      (album: Album) => album.id === albumId,
    );
    if (albumIndex === -1) {
      throw new UnprocessableEntityException("Album doesn't exist");
    }
    if (this.getAlbumIndexInFavourites(albumId) === -1) {
      this.db.favorites.albums.push(albumId);
    }
  }

  async deleteAlbumFromFavorites(albumId: string) {
    validateId(albumId);
    const albumIndex = this.getAlbumIndexInFavourites(albumId);
    if (albumIndex === -1) {
      throw new UnprocessableEntityException("Album doesn't exist");
    }
    this.db.favorites.albums.splice(albumIndex, 1);
  }

  getArtistIndexInFavourites(artistId: string): number {
    validateId(artistId);
    return this.db.favorites.artists.indexOf(artistId);
  }

  addArtistToFavorites(artistId: string) {
    validateId(artistId);
    const artistIndex = this.db.artists.findIndex(
      (artist: Artist) => artist.id === artistId,
    );
    if (artistIndex === -1) {
      throw new UnprocessableEntityException("Artist doesn't exist");
    }
    if (this.getArtistIndexInFavourites(artistId) === -1) {
      this.db.favorites.artists.push(artistId);
    }
  }

  async deleteArtistFromFavorites(artistId: string) {
    validateId(artistId);
    const artistIndex = this.getArtistIndexInFavourites(artistId);
    if (artistIndex === -1) {
      throw new UnprocessableEntityException("Artist doesn't exist");
    }
    this.db.favorites.artists.splice(artistIndex, 1);
  }
}
