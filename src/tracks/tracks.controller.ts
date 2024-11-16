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
    const getResult = await this.tracksService.getTrackById(id);
    if (getResult.error) {
      throw getResult.error;
    }
    return getResult.track;
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
    const updateResult = await this.tracksService.updateTrack(id, createTrackDto);
    if (updateResult.error) {
      throw updateResult.error;
    }
    return updateResult.track;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteTrack(@Param('id') id: string) {
    validateId(id);
    const deleteResult = await this.tracksService.deleteTrack(id);
    if (deleteResult.error) {
      throw deleteResult.error;
    }
  }
}
