import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
  Query,
} from '@nestjs/common';
import { EditService } from './edit.service';
import { CreateEditQuestionDto } from './dto/create-edit-question.dto';
import { UpdateEditDto } from './dto/update-edit.dto';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateEditAnswerDto } from './dto/create-edit-answer.dto';
import { GetEditDto } from './dto/get-edit.dto';

@Controller('edit')
export class EditController {
  constructor(private readonly editService: EditService) {}

  @ApiOperation({ summary: 'Create Question Edit Request' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('/question/:questionId')
  createEditQuestionRequest(
    @Body() createEditQuestionDto: CreateEditQuestionDto,
    @Param('questionId') questionId: string,
    @Request() req,
  ) {
    return this.editService.createEditQuestionRequest(
      createEditQuestionDto,
      +questionId,
      req,
    );
  }

  @ApiOperation({ summary: 'Create Question Edit Request' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('/answer/:answerId')
  createEditAnswerRequest(
    @Body() createEditAnswerDto: CreateEditAnswerDto,
    @Param('answerId') answerId: string,
    @Request() req,
  ) {
    return this.editService.createEditAnswerRequest(
      createEditAnswerDto,
      +answerId,
      req,
    );
  }

  @ApiOperation({ summary: 'Get all edits' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get()
  findAll(@Query() query: GetEditDto) {
    return this.editService.findAll(query);
  }

  @ApiOperation({ summary: 'Get user edit requests' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('/user')
  findUserRequests(@Query() query: GetEditDto,@Request() req) {
    return this.editService.findUserRequests(query,req);
  }

  @ApiOperation({ summary: 'Get edit by id' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.editService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update edit by id' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateEditDto: UpdateEditDto,
    @Request() req,
  ) {
    return this.editService.update(+id, updateEditDto, req);
  }

  @ApiOperation({ summary: 'Delete edit by id' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.editService.remove(+id, req);
  }
}
