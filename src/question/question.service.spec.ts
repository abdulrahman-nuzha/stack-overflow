import { Test, TestingModule } from '@nestjs/testing';
import { QuestionService } from './question.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AiService } from 'src/ai/ai.service';
import { PineconeService } from 'src/pinecone/pinecone.service';
import { EmbeddingService } from 'src/embedding/embedding.service';
import { Pinecone } from '@pinecone-database/pinecone';
import { RerankerService } from 'src/reranker/reranker.service';

describe('QuestionService', () => {
  let service: QuestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionService,
        PrismaService,
        AiService,
        PineconeService,
        EmbeddingService,
        Pinecone,
        RerankerService
      ],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
