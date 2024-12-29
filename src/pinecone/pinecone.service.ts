import { Injectable, OnModuleInit } from '@nestjs/common';
import { Pinecone } from '@pinecone-database/pinecone';
import { EmbeddingService } from 'src/embedding/embedding.service';import { RerankerService } from 'src/reranker/reranker.service';

@Injectable()
export class PineconeService {
  constructor(
    private pineconeClient: Pinecone,
    private readonly embeddingService: EmbeddingService,    
  ) {}

  private readonly indexName = 'questions-index';

  async onModuleInit() {
    this.pineconeClient = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY,
    });
  }

  async upsert(questionId: string, questionText: string) {
    try {
      const embedding =
        await this.embeddingService.getEmbeddingFromHuggingFace(questionText);

      if (
        !Array.isArray(embedding) ||
        embedding.length === 0 ||
        embedding.some((val) => typeof val !== 'number')
      ) {
        throw new Error('Invalid embedding data received from HuggingFace');
      }

      const upsertRequest = [
        {
          id: questionId,
          values: embedding,
        },
      ];

      const index = this.pineconeClient.Index(this.indexName);

      await index.upsert(upsertRequest);
    } catch (error) {
      console.log(error);
      throw new Error('Failed to upsert to pinecone');
    }
  }

  async findSimilarQuestions(queryText: string, topK = 5) {
    try {
      const embedding =
        await this.embeddingService.getEmbeddingFromHuggingFace(queryText);

      if (
        !Array.isArray(embedding) ||
        embedding.length === 0 ||
        embedding.some((val) => typeof val !== 'number')
      ) {
        throw new Error('Invalid embedding data received from HuggingFace');
      }

      const queryRequest = {
        vector: embedding,
        topK,
        includeValues: false,
        includeMetadata: true,
      };

      const index = this.pineconeClient.Index(this.indexName);
      const queryResponse = await index.query(queryRequest);
      const matches = queryResponse.matches;
      
      return matches;
    } catch (error) {
      console.log(error);
      throw new Error('Failed to find similarity in pinecone');
    }
  }
}
