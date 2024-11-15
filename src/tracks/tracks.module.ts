import { Module } from '@nestjs/common';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { db } from 'src/db';

@Module({
  controllers: [TracksController],
  providers: [
    TracksService,
    {
      provide: 'DB_CONNECTION',
      useValue: db,
    },
  ],
})
export class TracksModule {}
