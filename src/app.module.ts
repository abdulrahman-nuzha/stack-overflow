import { ClassSerializerInterceptor, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { QuestionModule } from './question/question.module';
import { AnswerModule } from './answer/answer.module';

@Module({
  imports: [AuthModule, UserModule, QuestionModule, AnswerModule],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule {}
