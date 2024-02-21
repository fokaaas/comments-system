import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { CommentService } from '../services/comment.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { JwtAuthGuard } from '../../security/guards/jwt-auth.guard';
import { QueryAllDTO } from '../dto/query-all.dto';

@Controller('comments')
export class CommentController {
  constructor (
    private commentService: CommentService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create (
    @Req() req,
    @Body() body: CreateCommentDto,
  ) {
    return this.commentService.create(req.user.id, body);
  }

  @Get()
  async getAll (
    @Query() query: QueryAllDTO,
  ) {
    return this.commentService.get(query);
  }
}
