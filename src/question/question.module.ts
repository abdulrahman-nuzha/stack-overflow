import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AiService } from 'src/ai/ai.service';
import { PineconeService } from 'src/pinecone/pinecone.service';
import { EmbeddingService } from 'src/embedding/embedding.service';
import { Pinecone } from '@pinecone-database/pinecone';
import { RerankerService } from 'src/reranker/reranker.service';
import { CohereClient } from 'cohere-ai/Client';

@Module({
  providers: [
    QuestionService,
    PrismaService,
    AiService,
    PineconeService,
    EmbeddingService,
    Pinecone,
    RerankerService,
    CohereClient
  ],
  controllers: [QuestionController],
})
export class QuestionModule {}
