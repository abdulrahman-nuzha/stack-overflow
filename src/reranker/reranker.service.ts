import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { CohereClient } from 'cohere-ai/Client';

@Injectable()
export class RerankerService {
  private readonly apiKey = process.env.HF_API_KEY;
  constructor(private cohereClient: CohereClient) {}
  async rerankQuestions(text: string, list: Array<string>) {
    const cohere = new CohereClient({
      token: process.env.COHERE_API_KEY,
    });

    const result = await cohere.rerank({
      documents: list,
      query: text,
      topN: 3,
      model: 'rerank-v3.5',
    });

    console.log('result::::::', result);
    return result;
  }
}
