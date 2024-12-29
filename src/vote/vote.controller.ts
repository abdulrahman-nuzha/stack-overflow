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
import { VoteService } from './vote.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { GetEditDto } from 'src/edit/dto/get-edit.dto';
import { GetVoteDto } from './dto/get-vote.dto';

@Controller('vote')
export class VoteController {
  constructor(private readonly voteService: VoteService) {}

  @ApiOperation({ summary: 'Create Question Vote' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('/question/:questionId')
  voteOnQuestion(
    @Body() createVoteDto: CreateVoteDto,
    @Param('questionId') questionId: string,
    @Request() req,
  ) {
    return this.voteService.voteOnQuestion(createVoteDto, +questionId, req);
  }

  @ApiOperation({ summary: 'Create Answer Vote' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Post('/answer/:answerId')
  voteOnAnswer(
    @Body() createVoteDto: CreateVoteDto,
    @Param('answerId') answerId: string,
    @Request() req,
  ) {
    return this.voteService.voteOnAnswer(createVoteDto, +answerId, req);
  }

  @ApiOperation({ summary: 'Get all votes' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get()
  findAll(@Query() query: GetVoteDto) {
    return this.voteService.findAll(query);
  }

  @ApiOperation({ summary: 'Get Total Votes for Question' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('/question/:questionId')
  getTotalVotesForQuestion(@Param('questionId') questionId: string) {
    return this.voteService.getTotalVotesForQuestion(+questionId);
  }

  @ApiOperation({ summary: 'Get Toatal Votes for answer' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Get('/answer/:answerId')
  getTotalVotesForAnswer(@Param('answerId') answerId: string) {
    return this.voteService.getTotalVotesForAnswer(+answerId);
  }

  @ApiOperation({ summary: 'Delete vote by id' })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('JWT-auth')
  @Delete(':id')
  remove(@Param('id') id: string, @Request() req) {
    return this.voteService.remove(+id, req);
  }
}
