import { Injectable } from '@nestjs/common';
import axios from 'axios';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private readonly apiKey = process.env.OPENROUTER_API_KEY;

  async generateAnswer(prompt: string): Promise<string> {
    try {
      const openai = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: this.apiKey,
      });

      const completion = await openai.chat.completions.create({
        model: 'meta-llama/llama-3.2-1b-instruct',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      });      
      return completion.choices[0].message.content;
    } catch (error) {
      console.error(
        'Error fetching AI response:',
        error.response?.data || error.message,
      );
      throw new Error('Failed to get AI response');
    }
  }
}
