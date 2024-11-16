import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../types/types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UsersService {
  constructor(private db: DatabaseService) {}

  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    const users = await this.db.user.findMany({
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return users.map((user) => {
      const userWithoutPassword = {
        ...user,
        createdAt: user.createdAt.getTime(),
        updatedAt: user.updatedAt.getTime(),
      };
      return userWithoutPassword;
    });
  }

  async getUserById(id: string):
    Promise<{
      user: User,
      error: Error | undefined,
    }> {
    const user = await this.db.user.findUnique({
      where: { id },
      select: {
        id: true,
        login: true,
        version: true,
        password: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return {
      user: user ? {
        ...user,
        createdAt: user.createdAt.getTime(),
        updatedAt: user.updatedAt.getTime(),
      } : undefined,
      error: !user ? new NotFoundException("User with this id doesn't found") : undefined,
    }
  }

  async addUser(createUserDto: CreateUserDto): Promise<Omit<User, 'password'>> {
    const newUser = await this.db.user.create({
      data: {
        login: createUserDto.login,
        id: uuidv4(),
        password: createUserDto.password,
        version: 1,
      },
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return {
      ...newUser,
      createdAt: newUser.createdAt.getTime(),
      updatedAt: newUser.updatedAt.getTime(),
    };
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ) : Promise<{
    user: Omit<User, 'password'>,
    error: Error | undefined,
  }> {
    const getResult = await this.getUserById(id);
    if (getResult.error || (!getResult.error && getResult.user.password !== updatePasswordDto.oldPassword)) {
      return {
        user: getResult.user,
        error: getResult.error,
      }
    }
    const updatedUser = await this.db.user.update({
      where: { id },
      data: { password: updatePasswordDto.newPassword },
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return {
      user: {
        ...updatedUser,
        createdAt: updatedUser.createdAt.getTime(),
        updatedAt: updatedUser.updatedAt.getTime(),
      },
      error: undefined,      
    };
  }

  async deleteUser(id: string) : Promise<{
    error: Error | undefined,
  }> {
    let error: Error;
    const getResult = await this.getUserById(id);
    if (getResult.error) {
      return {
        error: getResult.error,
      }
    }
    await this.db.user.delete({
      where: { id },
    });
    return {
      error: undefined,
    }
  }
}
