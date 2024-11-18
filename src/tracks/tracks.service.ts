import { Injectable, NotFoundException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Track } from '../types/types';
import { CreateTrackDto } from './dto/create-track.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class TracksService {
  constructor(private db: DatabaseService) {}

  async getAllTracks(): Promise<Track[]> {
    return await this.db.track.findMany();
  }

  async getTrackById(id: string): Promise<{
    track: Track;
    error: Error | undefined;
  }> {
    const track = await this.db.track.findUnique({
      where: { id },
    });
    return {
      track,
      error: !track
        ? new NotFoundException("Track with this id doesn't found")
        : undefined,
    };
  }

  async addTrack(createTrackDto: CreateTrackDto): Promise<Track> {
    return await this.db.track.create({
      data: {
        id: uuidv4(),
        ...createTrackDto,
      },
    });
  }

  async updateTrack(
    id: string,
    createTrackDto: CreateTrackDto,
  ): Promise<{
    track: Track;
    error: Error | undefined;
  }> {
    const getResult = await this.getTrackById(id);
    if (getResult.error) {
      return {
        track: getResult.track,
        error: getResult.error,
      };
    }
    const updatedTrack = await this.db.track.update({
      where: { id },
      data: {
        ...getResult.track,
        ...createTrackDto,
      },
    });
    return {
      track: updatedTrack,
      error: undefined,
    };
  }

  async deleteTrack(id: string): Promise<{
    error: Error | undefined;
  }> {
    const getResult = await this.getTrackById(id);
    if (getResult.error) {
      return {
        error: getResult.error,
      };
    }
    await this.db.track.delete({
      where: { id },
    });
    return {
      error: undefined,
    };
  }
}
