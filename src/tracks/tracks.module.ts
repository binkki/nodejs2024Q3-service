import { Module } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [TracksController],
  providers: [TracksService, DatabaseService],
})
export class TracksModule {}
