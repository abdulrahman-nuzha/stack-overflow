import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: createUserDto.email },
    });

    if (user)
      throw new HttpException('E-mail already Used', HttpStatus.BAD_REQUEST);

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const data = {
      ...createUserDto,
      password: hashedPassword,
    };
    delete data.confirmPassword;

    const newUser = await this.prisma.user.create({ data });
    delete newUser.password;
    return newUser;
  }
}
