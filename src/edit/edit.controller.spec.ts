import { Test, TestingModule } from '@nestjs/testing';
import { EditController } from './edit.controller';
import { EditService } from './edit.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('EditController', () => {
  let controller: EditController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EditController],
      providers: [EditService, PrismaService],
    }).compile();

    controller = module.get<EditController>(EditController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
