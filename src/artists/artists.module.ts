import { Module } from '@nestjs/common';
import { ArtistController } from './artists.controller';
import { ArtistService } from './artists.service';
import { db } from '../db';

@Module({
  controllers: [ArtistController],
  providers: [
    ArtistService,
    {
      provide: 'DB_CONNECTION',
      useValue: db,
    },
  ],
})
export class ArtistModule {}
