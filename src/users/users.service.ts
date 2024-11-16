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

  async getUserById(id: string): Promise<Omit<User, 'password'>> {
    const user = await this.db.user.findUnique({
      where: { id },
      select: {
        id: true,
        login: true,
        version: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    return new Promise((resolve, reject) => {
      if (!user)
        reject(new NotFoundException("User with this id doesn't found"));
      resolve({
        ...user,
        createdAt: user.createdAt.getTime(),
        updatedAt: user.updatedAt.getTime(),
      });
    });
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
  ): Promise<Omit<User, 'password'>> {
    let user: User;
    let error: Error;
    this.getUserById(id).then(
      (data: User) => (user = data),
      (getError: Error) => (error = getError),
    );
    if (!error && user.password !== updatePasswordDto.oldPassword) {
      error = new ForbiddenException('Old password is incorrect');
    }
    if (error) {
      return new Promise((resolve, reject) => reject(error));
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
      ...updatedUser,
      createdAt: updatedUser.createdAt.getTime(),
      updatedAt: updatedUser.updatedAt.getTime(),
    };
  }

  async deleteUser(id: string) {
    let error: Error;
    await this.getUserById(id).then(
      () => {
        return;
      },
      (getError) => (error = getError),
    );
    if (error !== undefined) {
      return new Promise((reject) => reject(error));
    }
    await this.db.user.delete({
      where: { id },
    });
  }
}
