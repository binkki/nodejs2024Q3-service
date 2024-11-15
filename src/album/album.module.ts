import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { db } from '../db';

@Module({
  controllers: [AlbumController],
  providers: [
    AlbumService,
    {
      provide: 'DB_CONNECTION',
      useValue: db,
    },
  ],
})
export class AlbumModule {}
