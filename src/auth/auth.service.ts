import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { JwtPayload } from './jwt.strategy';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { LoginUserDto } from 'src/user/dto/login-user.dto';
import { compare } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly prisma: PrismaService,
  ) {}

  async register(userDto: CreateUserDto): Promise<any> {
    try {
      const data: CreateUserDto = { ...userDto };
      const user = await this.userService.create(data);
      const token = this._createToken(user);      
      return {
        user,
        ...token,
        message: 'Account created successfully',
      };
    } catch (err) {
      throw new HttpException(err, HttpStatus.BAD_REQUEST, {
        cause: new Error(err),
      });
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email: loginUserDto.email },
    });
    if (!user) {
      throw new HttpException(
        'INVALID_EMAIL_PASSWORD',
        HttpStatus.UNAUTHORIZED,
      );
    }
    const isMatch = await compare(loginUserDto.password, user.password);
    if (!isMatch) {
      throw new HttpException(
        'INVALID_EMAIL_PASSWORD',
        HttpStatus.UNAUTHORIZED,
      );
    }

    const token = this._createToken(user);

    return {
      ...token,
      data: user,
    };
  }

  async logout(reg): Promise<any>{
      
  }

  async profile(req): Promise<User> {
    return await this.prisma.user.findUniqueOrThrow({
      where: {
        id: req.user.id,
      },
    });
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    if (payload.email != null) {
      return await this.prisma.user.findUnique({
        where: {
          email: payload.email,
        },
      });
    } else {
      throw new HttpException('INVALID PAYLOAD', HttpStatus.BAD_REQUEST);
    }
  }

  private _createToken({ email }): any {
    const user: JwtPayload = { email };
    const token = this.jwtService.sign(user);
    return {
      token,
    };
  }
}
