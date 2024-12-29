import { Module } from '@nestjs/common';
import { EditService } from './edit.service';
import { EditController } from './edit.controller';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [EditController],
  providers: [EditService,PrismaService],
})
export class EditModule {}
