import { IsString, IsNotEmpty } from 'class-validator';

export class UpdatePasswordDto {
  @IsString({ message: 'Old password must be a string' })
  @IsNotEmpty({ message: 'Old password required' })
  oldPassword: string;

  @IsString({ message: 'New password must be a string' })
  @IsNotEmpty({ message: 'New password required' })
  newPassword: string;
}
