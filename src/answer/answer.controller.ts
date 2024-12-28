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
import { AnswerService } from './answer.service';
import { CreateAnswerDto } from './dto/create-answer.dto';
import { UpdateAnswerDto } from './dto/update-answer.dto';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetAnswerDto } from './dto/get-answer.dto';

@Controller('answer')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @ApiOperation({ summary: 'Create Answer' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post()
  create(@Body() createAnswerDto: CreateAnswerDto, @Request() req) {
    return this.answerService.create(createAnswerDto, req);
  }

  @ApiOperation({ summary: 'Get all  Answers' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get()
  findAll(@Query() query: GetAnswerDto) {
    return this.answerService.findAll(query);
  }

  @ApiOperation({ summary: 'Get answers by id' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.answerService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update answer by id' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAnswerDto: UpdateAnswerDto,
    @Request() req,
  ) {
    return this.answerService.update(+id, updateAnswerDto, req);
  }

  @ApiOperation({ summary: 'Delete answer by id' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.answerService.remove(+id, req);
  }
}
