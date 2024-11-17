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
  BadRequestException,
} from '@nestjs/common';
import { User } from 'src/types/types';
import { UsersService } from './users.service';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { isValidPasswordDto, isValidUserDto, validateId } from 'src/utils/utils';

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
    validateId(id);
    const getResult = await this.usersService.getUserById(id);
    if (getResult.error) {
      throw getResult.error;
    }
    delete getResult.user["password"];
    return getResult.user;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async addUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<Omit<User, 'password'>> {
    if (!isValidUserDto(createUserDto)) {
      throw new BadRequestException('Wrong dto');
    }
    return await this.usersService.addUser(createUserDto);
  }

  @Put(':id')
  async updatePassword(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<Omit<User, 'password'>> {
    validateId(id);
    if (!isValidPasswordDto(updatePasswordDto)) {
      throw new BadRequestException('Wrong dto');
    }
    const updateResult = await this.usersService.updatePassword(id, updatePasswordDto);
    if (updateResult.error) {
      throw updateResult.error;
    }
    return updateResult.user;
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id') id: string) {
    validateId(id);
    const deleteResult = await this.usersService.deleteUser(id);
    if (deleteResult.error) {
      throw deleteResult.error;
    }
  }
}
