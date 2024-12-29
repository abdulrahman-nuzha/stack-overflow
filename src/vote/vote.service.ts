import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { GetVoteDto } from './dto/get-vote.dto';

@Injectable()
export class VoteService {
  constructor(private readonly prisma: PrismaService) {}
  async voteOnQuestion(createVoteDto: CreateVoteDto, questionId: number, req) {
    const { vote } = createVoteDto;

    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question)
      throw new HttpException("Question Doesn't Exist", HttpStatus.NOT_FOUND);

    const existingVote = await this.prisma.vote.findFirst({
      where: {
        userId: req.user.id,
        questionId: questionId,
      },
    });

    if (existingVote) {
      return await this.prisma.vote.update({
        where: { id: existingVote.id },
        data: { voteType: vote },
      });
    } else {
      return await this.prisma.vote.create({
        data: {
          userId: req.user.id,
          voteType: vote,
          questionId,
        },
      });
    }
  }
  
  async voteOnAnswer(createVoteDto: CreateVoteDto, answerId: number, req) {
    const { vote } = createVoteDto;

    const answer = await this.prisma.answer.findUnique({
      where: { id: answerId },
    });

    if (!answer)
      throw new HttpException("Answer Doesn't Exist", HttpStatus.NOT_FOUND);

    const existingVote = await this.prisma.vote.findFirst({
      where: {
        userId: req.user.id,
        answerId: answerId,
      },
    });

    if (existingVote) {
      return await this.prisma.vote.update({
        where: { id: existingVote.id },
        data: { voteType: vote },
      });
    } else {
      return await this.prisma.vote.create({
        data: {
          userId: req.user.id,
          voteType: vote,
          answerId,
        },
      });
    }
  }

  async findAll(query: GetVoteDto) {
    const options: Prisma.VoteFindManyArgs = {};
    if (query.sortBy) {
      options.orderBy = {
        [query.sortBy]: 'asc',
      };
    }

    if (query.answerId) {
      options.where = {
        answerId: query.answerId,
      };
    }
    if (query.questionId) {
      options.where = {
        ...options.where,
        answerId: query.questionId,
      };
    }

    const page = query.page ? parseInt(query.page) : 1;
    const rowsPerPage = query.rowsPerPage ? parseInt(query.rowsPerPage) : 10;

    if (!isNaN(page) && !isNaN(rowsPerPage)) {
      options.skip = (page - 1) * rowsPerPage;
      options.take = rowsPerPage;
    }
    const [data, total] = await Promise.all([
      this.prisma.vote.findMany(options),
      this.prisma.vote.count(),
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

  async getVotesForQuestion(query: GetVoteDto, questionId: number) {
    const options: Prisma.VoteFindManyArgs = {};
    if (query.sortBy) {
      options.orderBy = {
        [query.sortBy]: 'asc',
      };
    }

    options.where = {
      questionId: questionId,
    };

    const page = query.page ? parseInt(query.page) : 1;
    const rowsPerPage = query.rowsPerPage ? parseInt(query.rowsPerPage) : 10;

    if (!isNaN(page) && !isNaN(rowsPerPage)) {
      options.skip = (page - 1) * rowsPerPage;
      options.take = rowsPerPage;
    }
    const [data, total] = await Promise.all([
      this.prisma.vote.findMany(options),
      this.prisma.vote.count(),
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

  async getVotesForAnswer(query: GetVoteDto, answerId: number) {
    const options: Prisma.VoteFindManyArgs = {};
    if (query.sortBy) {
      options.orderBy = {
        [query.sortBy]: 'asc',
      };
    }

    options.where = {
      answerId: answerId,
    };

    const page = query.page ? parseInt(query.page) : 1;
    const rowsPerPage = query.rowsPerPage ? parseInt(query.rowsPerPage) : 10;

    if (!isNaN(page) && !isNaN(rowsPerPage)) {
      options.skip = (page - 1) * rowsPerPage;
      options.take = rowsPerPage;
    }
    const [data, total] = await Promise.all([
      this.prisma.vote.findMany(options),
      this.prisma.vote.count(),
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

  async getTotalVotesForQuestion(questionId: number) {
    const upvotes = await this.prisma.vote.count({
      where: {
        questionId,
        voteType: true,
      },
    });

    const downvotes = await this.prisma.vote.count({
      where: {
        questionId,
        voteType: false,
      },
    });

    return { upvotes, downvotes };
  }

  async getTotalVotesForAnswer(answerId: number) {
    const upvotes = await this.prisma.vote.count({
      where: {
        answerId,
        voteType: true,
      },
    });

    const downvotes = await this.prisma.vote.count({
      where: {
        answerId,
        voteType: false,
      },
    });

    return { upvotes, downvotes };
  }

  async remove(id: number, req) {
    const vote = await this.prisma.vote.findUnique({
      where: { id },
    });

    if (!vote) {
      throw new HttpException("Vote Doesn't Exist", HttpStatus.NOT_FOUND);
    }

    if (vote.userId !== req.user.id) {
      throw new HttpException(
        "You don't have permission to delete this vote",
        HttpStatus.FORBIDDEN,
      );
    }

    await this.prisma.vote.delete({
      where: { id },
    });

    return { message: 'Vote deleted successfully' };
  }
}
