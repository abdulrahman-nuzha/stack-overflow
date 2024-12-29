import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { Prisma, Question } from '@prisma/client';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { GetQuestionDto } from './dto/get-question.dto';
import { AiService } from 'src/ai/ai.service';
import { PineconeService } from 'src/pinecone/pinecone.service';
import { RerankerService } from 'src/reranker/reranker.service';

interface CreateData {
  title: string;
  body: string;
  userId: number;
}
interface UpdateData {
  title: string;
  body: string;
}

@Injectable()
export class QuestionService {
  constructor(
    private prisma: PrismaService,
    private readonly aiService: AiService,
    private readonly pineconeService: PineconeService,
    protected readonly rerankerService: RerankerService,
  ) {}

  async create(CreateQuestionDto: CreateQuestionDto, req) {
    const userId = req.user.id;
    const data: CreateData = {
      ...CreateQuestionDto,
      userId: userId,
    };

    const question = await this.prisma.question.create({ data });

    setImmediate(async () => {
      try {
        const prompt = `###title: ${question.title} \n ###body: ${question.body}`;
        const answer = await this.aiService.generateAnswer(prompt);

        await this.prisma.answer.create({
          data: {
            body: answer,
            userId: userId,
            questionId: question.id,
          },
        });

        await this.pineconeService.upsert(`${question.id}`, question.title);
      } catch (error) {
        console.error('Error processing background task:', error);
      }
    });

    return question;
  }

  async findAll(query: GetQuestionDto) {
    const options: Prisma.QuestionFindManyArgs = {};

    if (query.search) {
      options.where = {
        OR: [
          {
            title: {
              contains: query.search,
            },
          },
          {
            body: {
              contains: query.search,
            },
          },
        ],
      };
    }

    if (query.sortBy) {
      options.orderBy = {
        [query.sortBy]: 'asc',
      };
    }

    let page = 1;
    let rowsPerPage = 10;

    if (query.page && query.rowsPerPage) {
      page = parseInt(query.page);
      rowsPerPage = parseInt(query.rowsPerPage);

      if (!isNaN(page) && !isNaN(rowsPerPage)) {
        options.skip = (page - 1) * rowsPerPage;
        options.take = rowsPerPage;
      }
    }

    const [data, total] = await Promise.all([
      this.prisma.question.findMany(options),
      this.prisma.question.count(),
    ]);

    const totalPages = Math.ceil(total / rowsPerPage);

    return {
      data,
      meta: {
        total,
        page,
        rowsPerPage,
        totalPages,
      },
    };
  }

  async searchWithSimilarity(query) {
    if (!query.search) {
      throw new HttpException(
        'Search paramter is required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const result = await this.pineconeService.findSimilarQuestions(
      query.search,
    );

    const ids = result.map((item) => parseInt(item.id));

    const data = await this.prisma.question.findMany({
      where: {
        id: { in: ids },
      },
    });
    const doc = data.map((item) => item.title);
    const rerank = await this.rerankerService.rerankQuestions(
      query.search,
      doc,
    );
    console.log(doc);

    const reorderedList = rerank.results.map((item) => data[item.index]);

    return reorderedList;
  }

  async findOne(id: number) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      include: {
        answers: true,
      },
    });

    if (!question) {
      throw new HttpException("Question Doesn't Exist", HttpStatus.NOT_FOUND);
    }

    return question;
  }

  async update(id: number, UpdateQuestionDto: UpdateQuestionDto, req) {
    const question = await this.prisma.question.findUnique({
      where: { id: id },
    });
    if (!question)
      throw new HttpException("Question Doesn't Exist", HttpStatus.NOT_FOUND);

    if (question.userId !== req.user.id) {
      throw new HttpException(
        "You don't have permission to delete this answer",
        HttpStatus.FORBIDDEN,
      );
    }
    const updatedQuestion = await this.prisma.question.update({
      where: { id },
      data: UpdateQuestionDto,
      include: {
        answers: true,
      },
    });

    return updatedQuestion;
  }

  async remove(id: number, req) {
    const question = await this.prisma.question.findUnique({
      where: { id },
    });

    if (!question) {
      throw new HttpException("Question Doesn't Exist", HttpStatus.NOT_FOUND);
    }

    if (question.userId !== req.user.id) {
      throw new HttpException(
        "You don't have permission to delete this question",
        HttpStatus.FORBIDDEN,
      );
    }

    await this.prisma.question.delete({
      where: { id },
    });

    return { message: 'Question deleted successfully' };
  }
}
