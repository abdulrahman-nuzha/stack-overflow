import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UpdateEditDto } from './dto/update-edit.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateEditQuestionDto } from './dto/create-edit-question.dto';
import { CreateEditAnswerDto } from './dto/create-edit-answer.dto';
import { GetEditDto } from './dto/get-edit.dto';

@Injectable()
export class EditService {
  constructor(private readonly prisma: PrismaService) {}
  async createEditQuestionRequest(
    createEditQuestionDto: CreateEditQuestionDto,
    questionId: number,
    req,
  ) {
    const { newTitle, newBody } = createEditQuestionDto;
    const question = await this.prisma.question.findUnique({
      where: { id: questionId },
    });

    if (!question)
      throw new HttpException("Question Doesn't Exist", HttpStatus.NOT_FOUND);

    const userId = req.user.id;
    const data: any = {
      userId,
      questionId,
      newBody,
      newTitle,
    };

    if (question.userId === req.user.id) {
      data.isApproved = true;
      data.approvedAt = new Date();
    }
    const edit = await this.prisma.edit.create({ data });
    await this.applyApprovedEdit(edit);
    return edit;
  }
  async createEditAnswerRequest(
    createEditAnswerDto: CreateEditAnswerDto,
    answerId,
    req,
  ) {
    const { newBody } = createEditAnswerDto;

    const answer = await this.prisma.answer.findUnique({
      where: { id: answerId },
    });

    if (!answer)
      throw new HttpException("Answer Doesn't Exist", HttpStatus.NOT_FOUND);

    const userId = req.user.id;
    const data: any = {
      userId,
      answerId,
      newBody,
    };
    if (answer.userId === req.user.id) {
      data.isApproved = true;
      data.approvedAt = new Date();
    }

    const edit = await this.prisma.edit.create({ data });
    await this.applyApprovedEdit(edit);
    return edit;
  }

  async findAll(query: GetEditDto) {
    const options: Prisma.EditFindManyArgs = {};

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
      this.prisma.edit.findMany(options),
      this.prisma.edit.count(),
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
    const edit = await this.prisma.edit.findUnique({
      where: { id },
      include: {
        question: true,
        answer: true,
      },
    });

    if (!edit) {
      throw new HttpException("Edit Doesn't Exist", HttpStatus.NOT_FOUND);
    }

    return edit;
  }

  async findUserRequests(query: GetEditDto, req) {
    const options: Prisma.EditFindManyArgs = {};

    options.where = {
      userId: req.user.id,
    };

    if (query.approved) {
      options.where = {
        ...options.where,
        isApproved: query.approved,
      };
    }

    const page = query.page ? parseInt(query.page) : 1;
    const rowsPerPage = query.rowsPerPage ? parseInt(query.rowsPerPage) : 10;

    if (!isNaN(page) && !isNaN(rowsPerPage)) {
      options.skip = (page - 1) * rowsPerPage;
      options.take = rowsPerPage;
    }

    const [data, total] = await Promise.all([
      this.prisma.edit.findMany(options),
      this.prisma.edit.count(),
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

  async update(id: number, updateEditDto: UpdateEditDto, req) {
    const edit = await this.prisma.edit.findUnique({
      where: { id: id },
      include: {
        question: true,
        answer: true,
      },
    });
    if (!edit)
      throw new HttpException("Edit Doesn't Exist", HttpStatus.NOT_FOUND);

    if (
      (edit.questionId && edit.question?.userId !== req.user.id) ||
      (edit.answerId && edit.answer?.userId !== req.user.id)
    ) {
      throw new HttpException(
        "You don't have permission to accept this edit",
        HttpStatus.FORBIDDEN,
      );
    }

    if (edit.isApproved) {
      throw new HttpException(
        'This edit has already been approved and cannot be modified.',
        HttpStatus.BAD_REQUEST,
      );
    }
    const updatedEdit = await this.prisma.edit.update({
      where: { id },
      data: {
        isApproved: updateEditDto.approve,
        approvedAt: updateEditDto.approve ? new Date() : null,
      },
    });

    await this.applyApprovedEdit(updatedEdit);

    return updatedEdit;
  }

  async remove(id: number, req) {
    const edit = await this.prisma.edit.findUnique({
      where: { id },
    });

    if (!edit) {
      throw new HttpException("edit Doesn't Exist", HttpStatus.NOT_FOUND);
    }

    if (edit.userId !== req.user.id) {
      throw new HttpException(
        "You don't have permission to delete this edit",
        HttpStatus.FORBIDDEN,
      );
    }

    await this.prisma.edit.delete({
      where: { id },
    });

    return { message: 'Edit deleted successfully' };
  }

  async applyApprovedEdit(edit: any) {
    if (edit.isApproved === true) {
      if (edit.questionId) {
        const data: any = {};
        if (edit.newBody !== null) data.body = edit.newBody;
        if (edit.newTitle !== null) data.title = edit.newTitle;

        await this.prisma.question.update({
          where: { id: edit.questionId },
          data,
        });
      } else if (edit.answerId) {
        await this.prisma.answer.update({
          where: { id: edit.answerId },
          data: {
            body: edit.newBody,
          },
        });
      }
    }
  }
}
