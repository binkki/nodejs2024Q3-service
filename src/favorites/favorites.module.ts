import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { db } from '../db';

@Module({
  controllers: [FavoritesController],
  providers: [
    FavoritesService,
    {
      provide: 'DB_CONNECTION',
      useValue: db,
    },
  ],
})
export class FavoritesModule {}
