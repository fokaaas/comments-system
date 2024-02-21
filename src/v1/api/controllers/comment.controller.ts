import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommentService } from '../services/comment.service';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { JwtAuthGuard } from '../../security/guards/jwt-auth.guard';
import { QueryAllDTO } from '../dto/query-all.dto';
import { ImageValidatorPipe } from '../pipes/image-validator.pipe';
import { FileInterceptor } from '@nestjs/platform-express';
import { TxtValidatorPipe } from '../pipes/txt-validator.pipe';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PaginatedCommentsResponse } from '../responses/paginated-comments.response';
import { CommentResponse } from '../responses/comment.response';

@ApiTags('Comments')
@Controller('comments')
export class CommentController {
  constructor (
    private commentService: CommentService
  ) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: 'Create new comment' })
  @ApiResponse({ type: CommentResponse })
  async create (
    @Req() req,
    @Body() body: CreateCommentDto
  ) {
    return this.commentService.create(req.user.id, body);
  }

  @Get()
  @ApiOperation({ summary: 'Get all comments with sort' })
  @ApiResponse({ type: PaginatedCommentsResponse })
  async getAll (
    @Query() query: QueryAllDTO
  ) {
    return this.commentService.get(query);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post('/:commentId/image')
  @ApiOperation({ summary: 'Add image to comment' })
  @ApiResponse({ type: CommentResponse })
  async saveImage (
    @Req() req,
    @Param('commentId') commentId: string,
    @UploadedFile(ImageValidatorPipe) file: Express.Multer.File,
  ) {
    return this.commentService.saveImage(req.user.id, commentId, file);
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('txt'))
  @Post('/:commentId/txt')
  @ApiOperation({ summary: 'Add txt file to comment' })
  @ApiResponse({ type: CommentResponse })
  async saveTxt (
    @Req() req,
    @Param('commentId') commentId: string,
    @UploadedFile(TxtValidatorPipe) file: Express.Multer.File,
  ) {
    return this.commentService.saveTxt(req.user.id, commentId, file);
  }
}
