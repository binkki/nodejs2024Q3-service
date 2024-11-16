import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateArtistDto {
  id: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsBoolean()
  grammy: boolean;
}

export class UpdateArtistDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsBoolean()
  grammy?: boolean;
}
