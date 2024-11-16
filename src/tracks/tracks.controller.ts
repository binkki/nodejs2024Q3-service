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
} from '@nestjs/common';
import { TracksService } from './tracks.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { Track } from 'src/types/types';

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
    return await this.tracksService.getTrackById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addTrack(@Body() createTrackDto: CreateTrackDto): Promise<Track> {
    return await this.tracksService.addTrack(createTrackDto);
  }

  @Put(':id')
  async updateTrack(
    @Param('id') id: string,
    @Body() createTrackDto: CreateTrackDto,
  ): Promise<Track> {
    return await this.tracksService.updateTrack(id, createTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrack(@Param('id') id: string) {
    await this.tracksService.deleteTrack(id);
  }
}
