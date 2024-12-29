import { Test, TestingModule } from '@nestjs/testing';
import { PineconeService } from './pinecone.service';
import { EmbeddingService } from 'src/embedding/embedding.service';
import { Pinecone } from '@pinecone-database/pinecone';
import { RerankerService } from 'src/reranker/reranker.service';
import { CohereClient } from 'cohere-ai';

describe('PineconeService', () => {
  let service: PineconeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PineconeService,
        EmbeddingService,
        Pinecone,
        RerankerService,
        CohereClient,
      ],
    }).compile();

    service = module.get<PineconeService>(PineconeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
