import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { User } from 'src/types/types';
import { UsersService } from './users.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { getUserWithoutPassword } from 'src/utils/utils';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllUsers() {
    return await this.usersService.getAllUsers();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getUserById(@Param('id') id: string): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.getUserById(id);
    return getUserWithoutPassword(user);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.addUser(createUserDto);
    return getUserWithoutPassword(user);
  }

  @Put(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<Omit<User, 'password'>> {
    const user = await this.usersService.updatePassword(id, updatePasswordDto);
    return getUserWithoutPassword(user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string) {
    await this.usersService.deleteUser(id);
  }
}
