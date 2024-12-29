import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { QuestionModule } from './question/question.module';
import { AnswerModule } from './answer/answer.module';
import { EditModule } from './edit/edit.module';
import { VoteModule } from './vote/vote.module';
import { EmbeddingService } from './embedding/embedding.service';
import { PineconeService } from './pinecone/pinecone.service';
import { AiService } from './ai/ai.service';
import { Pinecone } from '@pinecone-database/pinecone';

@Module({
  imports: [AuthModule, UserModule, QuestionModule, AnswerModule, EditModule, VoteModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
    AiService,
    EmbeddingService,
    PineconeService,
    Pinecone
  ],
})
export class AppModule {}
