import { Test, TestingModule } from '@nestjs/testing';
import { AnswerController } from './answer.controller';
import { AnswerService } from './answer.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('AnswerController', () => {
  let controller: AnswerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AnswerController],
      providers: [AnswerService, PrismaService],
    }).compile();

    controller = module.get<AnswerController>(AnswerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
