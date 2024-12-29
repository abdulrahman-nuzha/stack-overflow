import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { QuestionService } from './question.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { GetQuestionDto } from './dto/get-question.dto';

@Controller('question')
export class QuestionController {
  constructor(private readonly questionService: QuestionService) {}

  @ApiOperation({ summary: 'Create Question' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post()
  create(@Body() CreateQuestionDto: CreateQuestionDto, @Request() req) {
    return this.questionService.create(CreateQuestionDto, req);
  }

  @ApiOperation({ summary: 'Get all questions' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get()
  findAll(@Query() query: GetQuestionDto) {
    return this.questionService.findAll(query);
  }

  @ApiOperation({ summary: 'Search with similarity' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('/search')
  searchWithSimilarity(@Query() search) {
    return this.questionService.searchWithSimilarity(search);
  }

  @ApiOperation({ summary: 'Get question by id' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.questionService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update question by id' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
    @Request() req,
  ) {
    return this.questionService.update(+id, updateQuestionDto, req);
  }

  @ApiOperation({ summary: 'Delete question by id' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.questionService.remove(+id, req);
  }
}
