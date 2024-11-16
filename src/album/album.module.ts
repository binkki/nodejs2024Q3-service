import { Module } from '@nestjs/common';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [AlbumController],
  providers: [AlbumService, DatabaseService],
})
export class AlbumModule {}
