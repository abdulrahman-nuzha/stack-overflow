import { Test, TestingModule } from '@nestjs/testing';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('QuestionController', () => {
  let controller: QuestionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuestionController],
      providers: [QuestionService, PrismaService],
    }).compile();

    controller = module.get<QuestionController>(QuestionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
