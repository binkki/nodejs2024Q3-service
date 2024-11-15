import { BadRequestException } from '@nestjs/common';
import { isUUID } from 'class-validator';
import { User } from 'src/types/types';

export const validateId = (id: string): boolean => {
  if (!isUUID(id)) {
    throw new BadRequestException(`Wrong id format`);
  }
  return true;
};

export const getUserWithoutPassword = (user: User): Omit<User, 'password'> => {
  const userCopy = { ...user };
  delete userCopy['password'];
  return userCopy;
};
