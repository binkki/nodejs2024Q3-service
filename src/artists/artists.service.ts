import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { CreateArtistDto, UpdateArtistDto } from './dto/artist.dto';
import { Album, Artist, Track } from 'src/types/types';
import { validateId } from '../utils/utils';

@Injectable()
export class ArtistService {
  constructor(@Inject('DB_CONNECTION') private readonly db) {}

  getAllArtists() {
    return this.db.artists;
  }

  async getArtistIndexById(id: string): Promise<number> {
    return await this.db.artists?.findIndex(
      (artist: Artist) => artist?.id === id,
    );
  }

  async getArtistById(id: string) {
    validateId(id);
    const artistIndex = await this.getArtistIndexById(id);
    if (artistIndex === -1) {
      throw new NotFoundException('User not found');
    }
    return this.db.artists[artistIndex];
  }

  addArtist(createArtistDto: CreateArtistDto) {
    const { name, grammy } = createArtistDto;
    if (!name || typeof name !== 'string' || !name.length) {
      throw new BadRequestException('Wrong createArtistDto');
    }
    if (!grammy || typeof grammy !== 'boolean') {
      throw new BadRequestException('Wrong createArtistDto');
    }
    const newArtist = { id: uuidv4(), ...createArtistDto };
    this.db.artists.push(newArtist);
    return newArtist;
  }

  async updateArtist(
    id: string,
    updateArtistDto: UpdateArtistDto,
  ): Promise<Artist> {
    const artist = await this.getArtistById(id);
    const { name } = updateArtistDto;
    if (!name || (name !== undefined && typeof name !== 'string')) {
      throw new BadRequestException('Wrong updateArtistDto');
    }
    const artistIndex = await this.getArtistIndexById(artist.id);
    this.db.artists[artistIndex] = {
      id: artist.id,
      name:
        updateArtistDto.name !== undefined ? updateArtistDto.name : artist.name,
      grammy:
        updateArtistDto.grammy !== undefined
          ? updateArtistDto.grammy
          : artist.grammy,
    };
    return this.db.artists[artistIndex];
  }

  async deleteArtist(id: string) {
    const artist = await this.getArtistById(id);
    const artistIndex = await this.getArtistIndexById(artist.id);
    this.db.artists.splice(artistIndex, 1);
    this.db.albums.forEach((album: Album) => {
      if (album.artistId === id) album.artistId = null;
    });
    this.db.tracks.forEach((track: Track) => {
      if (track.artistId === id) track.artistId = null;
    });
  }
}
