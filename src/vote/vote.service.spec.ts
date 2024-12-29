import { Test, TestingModule } from '@nestjs/testing';
import { VoteService } from './vote.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('VoteService', () => {
  let service: VoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [VoteService,PrismaService],
    }).compile();

    service = module.get<VoteService>(VoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
