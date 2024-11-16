import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateAlbumDto, UpdateAlbumDto } from './dto/album.dto';
import { Album } from '../types/types';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AlbumService {
  constructor(private db: DatabaseService) {}

  async getAllAlbums(): Promise<Album[]> {
    return await this.db.album.findMany();
  }

  async getAlbumById(id: string): Promise<Album | Error> {
    const album = await this.db.album.findUnique({
      where: { id },
    });
    return new Promise((resolve, reject) => {
      if (!album)
        reject(new NotFoundException("Album with this id doesn't found"));
      resolve(album);
    });
  }

  async addAlbum(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const newAlbum = await this.db.album.create({
      data: {
        id: uuidv4(),
        ...createAlbumDto,
      },
    });
    return newAlbum;
  }

  async updateAlbum(
    id: string,
    updateAlbumDto: UpdateAlbumDto,
  ): Promise<Album | Error> {
    let album: Album;
    let error: Error;
    this.getAlbumById(id).then(
      (data: Album) => (album = data),
      (getError: Error) => (error = getError),
    );
    if (error) {
      return new Promise((reject) => reject(error));
    }
    const updatedAlbum = await this.db.album.update({
      where: { id },
      data: {
        ...album,
        ...updateAlbumDto,
      },
    });
    return updatedAlbum;
  }

  async deleteAlbum(id: string): Promise<Error> {
    let error: Error;
    await this.getAlbumById(id).then(
      () => {
        return;
      },
      (getError) => (error = getError),
    );
    if (error !== undefined) {
      return new Promise((reject) => reject(error));
    }
    await this.db.album.delete({
      where: { id },
    });
  }
}
