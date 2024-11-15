import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { db } from 'src/db';

@Module({
  providers: [
    UsersService,
    {
      provide: 'DB_CONNECTION',
      useValue: db,
    },
  ],
  controllers: [UsersController],
})
export class UsersModule {}
