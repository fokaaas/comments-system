import { BadRequestException, Injectable } from '@nestjs/common';
import { CommentRepo } from '../../database/repos/comment.repo';
import { CreateCommentDto } from '../dto/create-comment.dto';
import { JSDOM } from 'jsdom';
import { QueryAllDTO, Sort, SortDTO } from '../dto/query-all.dto';
import { DatabaseUtils } from '../../utils/database.utils';
import { Comment } from '@prisma/client';
import _ from 'lodash';

@Injectable()
export class CommentService {
  constructor (
    private commentRepo: CommentRepo,
  ) {}

  private allowedTags = ['a', 'code', 'i', 'strong'];

  async create (userId: string, data: CreateCommentDto) {
    this.validateHtml(data.text);
    return this.commentRepo.create({ userId, ...data });
  }

  private validateHtml (text: string) {
    const dom = new JSDOM(text);
    const disallowedTags = Array.from(dom.window.document.body.children).filter(
      (node) => !this.allowedTags.includes(node.tagName.toLowerCase()),
    );

    if (disallowedTags.length > 0) {
      throw new BadRequestException('Invalid HTML detected.');
    }
  }

  private findDepth (treeData: Comment[], parentId: string) {
    const children = treeData.filter((node) => node.parentId === parentId);
    let maxDepth = 0;

    for (const child of children) {
      const depth = 1 + this.findDepth(treeData, child.id);
      maxDepth = Math.max(maxDepth, depth);
    }

    return maxDepth;
  }

  private getCommentSort ({ sort, order = 'desc' }: SortDTO, standardField: string): Sort | object {
    if (!sort) return {
      orderBy: {
        [standardField]: order,
      },
    };
    return {
      orderBy: {
        user: {
          [sort]: order,
        },
      },
    };
  }

  async get (query: QueryAllDTO) {
    const comments = await this.commentRepo.findMany({});
    const maxDepth = this.findDepth(comments, null);
    const sort = this.getCommentSort(query, 'createdAt');

    const includeObj: any = {
      include: { 
        responses: true, 
        user: {
          select: {
            username: true,
            email: true,
            avatar: true,
            homepage: true,
          },
        },
        files: {
          select: {
            link: true,
            type: true,
          },
        },
      },
    };

    const include = _.cloneDeep(includeObj);
    let currentLevel = include;

    for (let i = 1; i < maxDepth; i++) {
      currentLevel.include.responses = _.cloneDeep(includeObj);
      currentLevel = currentLevel.include.responses;
    }

    const data = {
      ...sort,
      where: {
        parentId: null,
      },
      ...include,
    };

    return await DatabaseUtils.paginate(this.commentRepo, query, data);
  }
}
