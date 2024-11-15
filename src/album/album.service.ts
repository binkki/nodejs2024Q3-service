import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/album.dto';
import { Album, DB, Track } from 'src/types/types';
import { validateId } from '../utils/utils';

@Injectable()
export class AlbumService {
  constructor(@Inject('DB_CONNECTION') private readonly db: DB) {}

  getAllAlbums(): Album[] {
    return this.db.albums;
  }

  async getAlbumIndexById(id: string): Promise<number> {
    return await this.db.albums?.findIndex((album: Album) => album?.id === id);
  }

  async getAlbumById(id: string): Promise<Album> {
    validateId(id);
    const albumIndex = await this.getAlbumIndexById(id);
    if (albumIndex === -1) {
      throw new NotFoundException('User not found');
    }
    return this.db.albums[albumIndex];
  }

  addAlbum(createAlbumDto: CreateAlbumDto): Album {
    const { name, year } = createAlbumDto;
    if (!name || typeof name !== 'string' || !name.length) {
      throw new BadRequestException('Wrong createAlbumDto');
    }
    if (!year || typeof year !== 'number') {
      throw new BadRequestException('Wrong createAlbumDto');
    }
    const newAlbum: Album = { id: uuidv4(), ...createAlbumDto };
    this.db.albums.push(newAlbum);
    return newAlbum;
  }

  async updateAlbum(
    id: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album> {
    const { name, year } = updateAlbumDto;
    if (!name || typeof name !== 'string' || !name.length) {
      throw new BadRequestException('Wrong updateAlbumDto');
    }
    if (!year || typeof year !== 'number') {
      throw new BadRequestException('Wrong updateAlbumDto');
    }
    const album = await this.getAlbumById(id);
    const albumIndex = await this.getAlbumIndexById(album.id);
    const updatedAlbum = {
      ...this.db.albums[albumIndex],
      ...updateAlbumDto,
    };
    this.db.albums[albumIndex] = updatedAlbum;
    return updatedAlbum;
  }

  async deleteAlbum(id: string) {
    const album = await this.getAlbumById(id);
    const albumIndex = await this.getAlbumIndexById(album.id);
    this.db.albums.splice(albumIndex, 1);
    this.db.tracks.forEach((track: Track) => {
      if (track.albumId === id) track.albumId = null;
    });
  }
}
