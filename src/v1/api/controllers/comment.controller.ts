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

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @Post('/:commentId/image')
  async saveImage (
    @Req() req,
    @Param('commentId') commentId: string,
    @UploadedFile(ImageValidatorPipe) file: Express.Multer.File,
  ) {
    return this.commentService.saveImage(req.user.id, commentId, file);
  }

  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('txt'))
  @Post('/:commentId/image')
  async saveTxt (
    @Req() req,
    @Param('commentId') commentId: string,
    @UploadedFile(TxtValidatorPipe) file: Express.Multer.File,
  ) {
    return this.commentService.saveTxt(req.user.id, commentId, file);
  }
}
