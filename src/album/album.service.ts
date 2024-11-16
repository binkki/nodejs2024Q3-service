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

  async getAlbumById(id: string):
    Promise<{
      album: Album,
      error: Error | undefined,
    }> {
    const album = await this.db.album.findUnique({ where: { id } });
    return {
      album,
      error: !album ? new NotFoundException("Album with this id doesn't found") : undefined,
    }
  }

  async addAlbum(createAlbumDto: CreateAlbumDto) : Promise<Album> {
    return await this.db.album.create({
      data: {
        id: uuidv4(),
        ...createAlbumDto,
      },
    });
  }

  async updateAlbum(
    id: string,
    updateAlbumDto: UpdateAlbumDto,
  ):
  Promise<{
    album: Album,
    error: Error | undefined,
  }> {
    const getResult = await this.getAlbumById(id);
    if (getResult.error) {
      return {
        album: getResult.album,
        error: getResult.error,
      }
    }
    const updatedAlbum = await this.db.album.update({
      where: { id },
      data: { 
        ...getResult.album,
        ...updateAlbumDto,
      },
    });
    return {
      album: updatedAlbum,
      error: undefined,      
    };
  }

  async deleteAlbum(id: string) : Promise<{
    error: Error | undefined,
  }> {
    const getResult = await this.getAlbumById(id);
    if (getResult.error) {
      return {
        error: getResult.error,
      }
    }
    await this.db.album.delete({
      where: { id },
    });
    return {
      error: undefined,
    }
  }
}
