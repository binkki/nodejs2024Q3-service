import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class AuthService {
  constructor(
    private db: DatabaseService,
    private jwtService: JwtService,
  ) {}

  async signup(signupDto: SignupDto) {
    const hashedPassword = await bcrypt.hash(
      signupDto.password,
      Number(process.env.CRYPT_SALT),
    );
    const newUser = await this.db.user.create({
        data: {
          login: signupDto.login,
          id: uuidv4(),
          password: hashedPassword,
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

  async login(loginDto: LoginDto) {
    const user = await this.db.user.findFirst({
        where: { login: loginDto.login },
        select: {
          id: true,
          login: true,
          version: true,
          password: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    if (!user) {
        throw new NotFoundException("User with this login doesn't found");
    }

    const isValidPassword = await bcrypt.compare(loginDto.password, user.password);
    
    if (!isValidPassword) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this.jwtService.sign({
        userId: user.id,
        login: user.login
    });
    return { accessToken };
  }

  async refresh(refreshToken: string): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });
      const newPayload = { userId: payload.userId, login: payload.login };
      return { 
        accessToken: this.jwtService.sign(newPayload),
        refreshToken: this.jwtService.sign(newPayload, {
          secret: process.env.JWT_SECRET_REFRESH_KEY,
          expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
        })
      };
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}