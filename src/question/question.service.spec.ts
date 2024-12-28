import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from './question.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('QuestionService', () => {
  let service: QuestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [QuestionService, PrismaService],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
