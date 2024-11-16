import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { Track } from 'src/types/types';
import { isValidTrackDto, validateId } from 'src/utils/utils';

@Controller('track')
export class TracksController {
  constructor(private readonly tracksService: TracksService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllTracks() {
    return await this.tracksService.getAllTracks();
  }

  @Get(':id')
  async getTrackById(@Param('id') id: string): Promise<Track> {
    validateId(id);
    let track: Track;
    this.tracksService.getTrackById(id).then(
      (data: Track) => (track = data),
      (error: Error) => {
        throw error;
      },
    );
    return track;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addTrack(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
    if (!isValidTrackDto(createTrackDto)) {
      throw new BadRequestException('Wrong dto');
    }
    return await this.tracksService.addTrack(createTrackDto);
  }

  @Put(':id')
  async updateTrack(
    @Param('id') id: string,
    @Body() createTrackDto: CreateTrackDto,
  ): Promise<Track> {
    validateId(id);
    if (!isValidTrackDto(createTrackDto)) {
      throw new BadRequestException('Wrong dto');
    }
    let track: Track;
    this.tracksService.updateTrack(id, createTrackDto).then(
      (data: Track) => (track = data),
      (error: Error) => {
        throw error;
      },
    );
    return track;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrack(@Param('id') id: string) {
    validateId(id);
    this.tracksService.deleteTrack(id).then(
      () => {
        return;
      },
      (error: Error) => {
        throw error;
      },
    );
  }
}
