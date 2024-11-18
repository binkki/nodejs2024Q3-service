import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto, UpdateArtistDto } from './dto/artist.dto';
import { Artist } from 'src/types/types';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class ArtistService {
  constructor(private db: DatabaseService) {}

  async getAllArtists() {
    return await this.db.artist.findMany();
  }

  async getArtistById(id: string): Promise<{
    artist: Artist;
    error: Error | undefined;
  }> {
    const artist = await this.db.artist.findUnique({
      where: { id },
    });
    return {
      artist,
      error: !artist
        ? new NotFoundException("Artist with this id doesn't found")
        : undefined,
    };
  }

  async addArtist(createArtistDto: CreateArtistDto) {
    return await this.db.artist.create({
      data: {
        id: uuidv4(),
        ...createArtistDto,
      },
    });
  }

  async updateArtist(
    id: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<{
    artist: Artist;
    error: Error | undefined;
  }> {
    const getResult = await this.getArtistById(id);
    if (getResult.error) {
      return {
        artist: getResult.artist,
        error: getResult.error,
      };
    }
    const updatedArtist = await this.db.artist.update({
      where: { id },
      data: {
        ...getResult.artist,
        ...updateArtistDto,
      },
    });
    return {
      artist: updatedArtist,
      error: undefined,
    };
  }

  async deleteArtist(id: string): Promise<{
    error: Error | undefined;
  }> {
    const getResult = await this.getArtistById(id);
    if (getResult.error) {
      return {
        error: getResult.error,
      };
    }
    await this.db.artist.delete({
      where: { id },
    });
    return {
      error: undefined,
    };
  }
}
