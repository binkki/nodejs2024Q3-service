import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { TracksService } from 'src/tracks/tracks.service';
import { AlbumService } from 'src/album/album.service';
import { ArtistService } from 'src/artists/artists.service';
import { getFavoriteArray } from 'src/utils/utils';

@Injectable()
export class FavoritesService {
  constructor(
    private db: DatabaseService,
    private trackService: TracksService,
    private albumService: AlbumService,
    private artistService: ArtistService,
  ) {}

  async getAllFavorites() {
    const favorites = await this.getFavoriteObject();
    const allAlbums = await this.albumService.getAllAlbums();
    const allTracks = await this.trackService.getAllTracks();
    const allArtists = await this.artistService.getAllArtists();

    return {
      albums: getFavoriteArray(favorites?.albums, allAlbums),
      artists: getFavoriteArray(favorites?.artists, allArtists),
      tracks: getFavoriteArray(favorites?.tracks, allTracks),
    };
  }

  async getFavoriteObject() {
    return await this.db.favorites.findFirst({
      select: {
        id: true,
        albums: true,
        artists: true,
        tracks: true,
      },
    });
  }

  async addTrackToFavorites(trackId: string): Promise<Error> {
    const getResult = await this.trackService.getTrackById(trackId);
    if (getResult.error) {
      return new UnprocessableEntityException("Track doesn't exist");
    }
    const favorites = await this.getFavoriteObject();
    const isAlreadyInFav = favorites.artists.indexOf(trackId);
    if (isAlreadyInFav === -1) {
      await this.db.favorites.update({
        where: { id: favorites.id },
        data: {
          tracks: {
            set: [...favorites.tracks, trackId],
          },
        },
      });
    }
  }

  async deleteTrackFromFavorites(trackId: string): Promise<Error> {
    const getResult = await this.trackService.getTrackById(trackId);
    if (getResult.error) {
      return new UnprocessableEntityException("Track doesn't exist");
    }
    const favorites = await this.getFavoriteObject();
    await this.db.favorites.update({
      where: { id: favorites.id },
      data: {
        tracks: {
          set: [...favorites.tracks.filter((track) => track !== trackId)],
        },
      },
    });
  }

  async addAlbumToFavorites(albumId: string): Promise<Error> {
    const getResult = await this.albumService.getAlbumById(albumId);
    if (getResult.error) {
      return new UnprocessableEntityException("Album doesn't exist");
    }
    const favorites = await this.getFavoriteObject();
    const isAlreadyInFav = favorites.artists.indexOf(albumId);
    if (isAlreadyInFav === -1) {
      await this.db.favorites.update({
        where: { id: favorites.id },
        data: {
          albums: {
            set: [...favorites.albums, albumId],
          },
        },
      });
    }
  }

  async deleteAlbumFromFavorites(albumId: string): Promise<Error> {
    const getResult = await this.albumService.getAlbumById(albumId);
    if (getResult.error) {
      return new UnprocessableEntityException("Album doesn't exist");
    }
    const favorites = await this.getFavoriteObject();
    await this.db.favorites.update({
      where: { id: favorites.id },
      data: {
        albums: {
          set: [...favorites.albums.filter((album) => album !== albumId)],
        },
      },
    });
  }

  async addArtistToFavorites(artistId: string): Promise<Error> {
    const getResult = await this.artistService.getArtistById(artistId);
    if (getResult.error) {
      return new UnprocessableEntityException("Artist doesn't exist");
    }
    const favorites = await this.getFavoriteObject();
    const isAlreadyInFav = favorites.artists.indexOf(artistId);
    if (isAlreadyInFav === -1) {
      await this.db.favorites.update({
        where: { id: favorites.id },
        data: {
          artists: {
            set: [...favorites.artists, artistId],
          },
        },
      });
    }
  }

  async deleteArtistFromFavorites(artistId: string): Promise<Error> {
    const getResult = await this.artistService.getArtistById(artistId);
    if (getResult.error) {
      return new UnprocessableEntityException("Artist doesn't exist");
    }
    const favorites = await this.getFavoriteObject();
    await this.db.favorites.update({
      where: { id: favorites.id },
      data: {
        artists: {
          set: [...favorites.artists.filter((artist) => artist !== artistId)],
        },
      },
    });
  }
}
