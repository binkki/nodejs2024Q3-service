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

  async getArtistById(id: string): Promise<Artist | Error> {
    const artist = await this.db.artist.findUnique({
      where: { id },
    });
    return new Promise((resolve, reject) => {
      if (!artist)
        reject(new NotFoundException("Artist with this id doesn't found"));
      resolve(artist);
    });
  }

  async addArtist(createArtistDto: CreateArtistDto) {
    const newArtist = await this.db.artist.create({
      data: {
        id: uuidv4(),
        ...createArtistDto,
      },
    });
    return newArtist;
  }

  async updateArtist(
    id: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<Artist | Error> {
    let artist: Artist;
    let error: Error;
    this.getArtistById(id).then(
      (data: Artist) => (artist = data),
      (getError: Error) => (error = getError),
    );
    if (error) {
      return new Promise((reject) => reject(error));
    }
    const updatedArtist = await this.db.artist.update({
      where: { id },
      data: {
        ...artist,
        ...updateArtistDto,
      },
    });
    return updatedArtist;
  }

  async deleteArtist(id: string) {
    let error: Error;
    await this.getArtistById(id).then(
      () => {
        return;
      },
      (getError) => (error = getError),
    );
    if (error !== undefined) {
      return new Promise((reject) => reject(error));
    }
    await this.db.artist.delete({
      where: { id },
    });
  }
}
