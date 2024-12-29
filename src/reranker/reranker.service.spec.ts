import { Test, TestingModule } from '@nestjs/testing';
import { RerankerService } from './reranker.service';
import { CohereClient } from 'cohere-ai/Client';

describe('RerankerService', () => {
  let service: RerankerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RerankerService,CohereClient],
    }).compile();

    service = module.get<RerankerService>(RerankerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
