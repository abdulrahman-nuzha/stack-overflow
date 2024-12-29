import { Module } from '@nestjs/common';
import { QuestionService } from './question.service';
import { QuestionController } from './question.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { AiService } from 'src/ai/ai.service';
import { PineconeService } from 'src/pinecone/pinecone.service';
import { EmbeddingService } from 'src/embedding/embedding.service';
import { Pinecone } from '@pinecone-database/pinecone';

@Module({
  providers: [
    QuestionService,
    PrismaService,
    AiService,
    PineconeService,
    EmbeddingService,
    Pinecone,
  ],
  controllers: [QuestionController],
})
export class QuestionModule {}
