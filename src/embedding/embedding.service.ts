import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class EmbeddingService {
  private readonly apiKey = process.env.HF_API_KEY;

  constructor() {}
  async getEmbeddingFromHuggingFace(text: string): Promise<number[]> {
    const modelId = 'sentence-transformers/all-MiniLM-L6-v2';

    const response = await axios.post(
      `https://api-inference.huggingface.co/pipeline/feature-extraction/${modelId}`,
      { inputs: text },
      {
        headers: { Authorization: `Bearer ${this.apiKey}` },
      },
    );

    // The response is usually a nested list, we might need to flatten/average.
    // E.g. response.data = [[ vector_of_numbers ]]
    const embeddings: number[] = response.data;    
    return embeddings;
  }
}
