import { Module } from '@nestjs/common';
import { ArtistController } from './artists.controller';
import { ArtistService } from './artists.service';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ArtistController],
  providers: [ArtistService],
})
export class ArtistModule {}
