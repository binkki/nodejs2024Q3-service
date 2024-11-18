import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { DatabaseService } from 'src/database/database.service';
import { ArtistService } from 'src/artists/artists.service';
import { AlbumService } from 'src/album/album.service';
import { TracksService } from 'src/tracks/tracks.service';

@Module({
  controllers: [FavoritesController],
  providers: [
    FavoritesService,
    TracksService,
    AlbumService,
    ArtistService,
    DatabaseService,
  ],
})
export class FavoritesModule {}
