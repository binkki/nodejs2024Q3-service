import { BadRequestException } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { User } from 'src/types/types';
import { CreateAlbumDto, UpdateAlbumDto } from 'src/album/dto/album.dto';
import { CreateArtistDto, UpdateArtistDto } from 'src/artists/dto/artist.dto';
import { CreateTrackDto } from 'src/tracks/dto/create-track.dto';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UpdatePasswordDto } from 'src/users/dto/update-password.dto';

export const validateId = (id: string): boolean => {
  if (!isUUID(id)) {
    throw new BadRequestException(`Wrong id format`);
  }
  return true;
};

export const isValidAlbumDto = (
  dto: CreateAlbumDto | UpdateAlbumDto,
): boolean =>
  !(
    !dto.name ||
    typeof dto.name !== 'string' ||
    !dto.name.length ||
    !dto.year ||
    typeof dto.year !== 'number'
  );

export const isValidArtistDto = (
  dto: CreateArtistDto | UpdateArtistDto,
): boolean => !(!dto.name || typeof dto.name !== 'string' || !dto.name.length);

export const isValidTrackDto = (dto: CreateTrackDto): boolean =>
  !(
    !dto.name ||
    typeof dto.name !== 'string' ||
    !dto.name.length ||
    !dto.duration ||
    typeof dto.duration !== 'number'
  );

export const isValidUserDto = (dto: CreateUserDto): boolean =>
  !(
    !dto.login ||
    typeof dto.login !== 'string' ||
    !dto.login.length ||
    !dto.password ||
    typeof dto.password !== 'string' ||
    !dto.password.length
  );

export const isValidPasswordDto = (dto: UpdatePasswordDto): boolean =>
  !(
    !dto.newPassword ||
    typeof dto.newPassword !== 'string' ||
    !dto.newPassword.length ||
    !dto.oldPassword ||
    typeof dto.oldPassword !== 'string' ||
    !dto.oldPassword.length
  );
