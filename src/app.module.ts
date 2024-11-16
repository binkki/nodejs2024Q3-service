import { Module } from '@nestjs/common';
import { AlbumModule } from './album/album.module';
import { ArtistModule } from './artists/artists.module';
import { TracksModule } from './tracks/tracks.module';
import { UsersModule } from './users/users.module';
import { FavoritesModule } from './favorites/favorites.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { db } from './db';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    UsersModule,
    TracksModule,
    ArtistModule,
    AlbumModule,
    FavoritesModule,
    DatabaseModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: 'DB_CONNECTION', useValue: db }],
})
export class AppModule {}
