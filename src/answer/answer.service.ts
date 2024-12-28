import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetAnswerDto } from './dto/get-answer.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AnswerService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createAnswerDto: CreateAnswerDto, req) {
    const { questionId } = createAnswerDto;
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question)
      throw new HttpException("Question Doesn't Exist", HttpStatus.NOT_FOUND);

    const userId = req.user.id;
    const data = {
      ...createAnswerDto,
      userId,
      questionId,
    };

    return await this.prisma.answer.create({ data });
  }

  async findAll(query: GetAnswerDto) {
    const options: Prisma.AnswerFindManyArgs = {};

    if (query.sortBy) {
      options.orderBy = {
        [query.sortBy]: 'asc',
      };
    }

    if (query.question_id) {
      options.where = {
        ...options.where,
        question: {
          id: query.question_id,
        },
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
      this.prisma.answer.findMany(options),
      this.prisma.answer.count(),
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

  async findOne(id: number) {
    const answer = await this.prisma.answer.findUnique({
      where: { id },
    });

    if (!answer) {
      throw new HttpException("Answer Doesn't Exist", HttpStatus.NOT_FOUND);
    }

    return answer;
  }

  async update(id: number, updateAnswerDto: UpdateAnswerDto, req) {
    const answer = await this.prisma.answer.findUnique({
      where: { id: id },
    });
    if (!answer)
      throw new HttpException("Answer Doesn't Exist", HttpStatus.NOT_FOUND);

    if (answer.userId !== req.user.id) {
      throw new HttpException(
        "You don't have permission to delete this answer",
        HttpStatus.FORBIDDEN,
      );
    }
    const updatedAnswer = await this.prisma.answer.update({
      where: { id },
      data: updateAnswerDto,
    });

    return updatedAnswer;
  }

  async remove(id: number, req) {
    const answer = await this.prisma.answer.findUnique({
      where: { id },
    });

    if (!answer) {
      throw new HttpException("Answer Doesn't Exist", HttpStatus.NOT_FOUND);
    }

    if (answer.userId !== req.user.id) {
      throw new HttpException(
        "You don't have permission to delete this answer",
        HttpStatus.FORBIDDEN,
      );
    }

    await this.prisma.answer.delete({
      where: { id },
    });

    return { message: 'Answer deleted successfully' };
  }

  async;
}
