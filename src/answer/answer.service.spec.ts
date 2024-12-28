import { Test, TestingModule } from '@nestjs/testing';
import { AnswerService } from './answer.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('AnswerService', () => {
  let service: AnswerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AnswerService,PrismaService],
    }).compile();

    service = module.get<AnswerService>(AnswerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
