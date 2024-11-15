import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DB, Track } from '../types/types';
import { CreateTrackDto } from './dto/create-track.dto';
import { validateId } from 'src/utils/utils';

@Injectable()
export class TracksService {
  constructor(@Inject('DB_CONNECTION') private readonly db: DB) {}

  async getAllTracks(): Promise<Track[]> {
    return await this.db.tracks;
  }

  async getTrackIndexById(id: string): Promise<number> {
    return await this.db.tracks?.findIndex((track: Track) => track?.id === id);
  }

  async getTrackById(id: string): Promise<Track> {
    validateId(id);
    const trackIndex = await this.getTrackIndexById(id);
    if (trackIndex === -1) {
      throw new NotFoundException('Track not found');
    }
    return this.db.tracks[trackIndex];
  }

  async addTrack(createTrackDto: CreateTrackDto): Promise<Track> {
    const { name, duration, artistId, albumId } = createTrackDto;
    if (!name || typeof name !== 'string' || !name.length) {
      throw new BadRequestException('Wrong createTrackDto');
    }
    if (!duration || typeof duration !== 'number') {
      throw new BadRequestException('Wrong createTrackDto');
    }
    const track: Track = {
      id: uuidv4(),
      name,
      artistId,
      albumId,
      duration,
    };
    this.db.tracks.push(track);
    return track;
  }

  async updateTrack(
    id: string,
    createTrackDto: CreateTrackDto,
  ): Promise<Track> {
    const { name, duration, artistId, albumId } = createTrackDto;
    if (!name || typeof name !== 'string' || !name.length) {
      throw new BadRequestException('Wrong createTrackDto');
    }
    if (!duration || typeof duration !== 'number') {
      throw new BadRequestException('Wrong createTrackDto');
    }
    const track = await this.getTrackById(id);
    const trackIndex = await this.getTrackIndexById(track.id);
    this.db.tracks[trackIndex] = {
      ...this.db.tracks[trackIndex],
      name,
      artistId,
      albumId,
      duration,
    };
    return this.db.tracks[trackIndex];
  }

  async deleteTrack(trackId: string) {
    const track = await this.getTrackById(trackId);
    const trackIndex = await this.getTrackIndexById(track.id);
    this.db.tracks.splice(trackIndex, 1);
  }
}
