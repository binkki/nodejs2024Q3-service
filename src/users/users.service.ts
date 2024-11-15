import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
  BadRequestException,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { DB, User } from '../types/types';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { validateId } from '../utils/utils';

@Injectable()
export class UsersService {
  constructor(@Inject('DB_CONNECTION') private readonly db: DB) {}

  async getAllUsers(): Promise<User[]> {
    return await this.db.users;
  }

  async getUserIndexById(id: string): Promise<number> {
    return await this.db.users?.findIndex((user: User) => user?.id === id);
  }

  async getUserById(id: string): Promise<User> {
    validateId(id);
    const userIndex = await this.getUserIndexById(id);
    if (userIndex === -1) {
      throw new NotFoundException('User not found');
    }
    return this.db.users[userIndex];
  }

  async addUser(createUserDto: CreateUserDto): Promise<User> {
    const { login, password } = createUserDto;
    if (!login || typeof login !== 'string' || !login.length) {
      throw new BadRequestException('Wrong updatePasswordDto');
    }
    if (!password || typeof password !== 'string' || !password.length) {
      throw new BadRequestException('Wrong updatePasswordDto');
    }
    const user: User = {
      id: uuidv4(),
      login: createUserDto.login,
      password: createUserDto.password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await this.db.users.push(user);
    return user;
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<User> {
    const { newPassword, oldPassword } = updatePasswordDto;
    if (
      !newPassword ||
      typeof newPassword !== 'string' ||
      !newPassword.length
    ) {
      throw new BadRequestException('Wrong updatePasswordDto');
    }
    if (
      !oldPassword ||
      typeof oldPassword !== 'string' ||
      !oldPassword.length
    ) {
      throw new BadRequestException('Wrong updatePasswordDto');
    }
    const user = await this.getUserById(id);
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }
    const userIndex = await this.getUserIndexById(user.id);
    this.db.users[userIndex] = {
      ...this.db.users[userIndex],
      password: updatePasswordDto.newPassword,
      version: this.db.users[userIndex].version + 1,
      updatedAt: Date.now(),
    };
    return this.db.users[userIndex];
  }

  async deleteUser(id: string) {
    const user = await this.getUserById(id);
    const userIndex = await this.getUserIndexById(user.id);
    this.db.users.splice(userIndex, 1);
  }
}
