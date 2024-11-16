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

  async getTrackById(id: string): Promise<Track | Error> {
    const track = await this.db.track.findUnique({
      where: { id },
    });
    return new Promise((resolve, reject) => {
      if (!track)
        reject(new NotFoundException("Track with this id doesn't found"));
      resolve(track);
    });
  }

  async addTrack(createTrackDto: CreateTrackDto): Promise<Track> {
    const newTrack = await this.db.track.create({
      data: {
        id: uuidv4(),
        ...createTrackDto,
      },
    });
    return newTrack;
  }

  async updateTrack(
    id: string,
    createTrackDto: CreateTrackDto,
  ): Promise<Track | Error> {
    let track: Track;
    let error: Error;
    this.getTrackById(id).then(
      (data: Track) => (track = data),
      (getError: Error) => (error = getError),
    );
    if (error) {
      return new Promise((reject) => reject(error));
    }
    const updatedTrack = await this.db.track.update({
      where: { id },
      data: {
        ...track,
        ...createTrackDto,
      },
    });
    return updatedTrack;
  }

  async deleteTrack(id: string) {
    let error: Error;
    await this.getTrackById(id).then(
      () => {
        return;
      },
      (getError) => (error = getError),
    );
    if (error !== undefined) {
      return new Promise((reject) => reject(error));
    }
    await this.db.track.delete({
      where: { id },
    });
  }
}
