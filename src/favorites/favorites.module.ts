import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { DatabaseService } from 'src/database/database.service';

@Module({
  controllers: [FavoritesController],
  providers: [FavoritesService, DatabaseService],
})
export class FavoritesModule {}
