import { Test, TestingModule } from '@nestjs/testing';
import { VoteController } from './vote.controller';
import { VoteService } from './vote.service';
import { PrismaService } from 'src/prisma/prisma.service';

describe('VoteController', () => {
  let controller: VoteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [VoteController],
      providers: [VoteService,PrismaService],
    }).compile();

    controller = module.get<VoteController>(VoteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
