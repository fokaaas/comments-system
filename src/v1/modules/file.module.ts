import { Module } from '@nestjs/common';
import { FileService } from '../api/services/file.service';

@Module({
  providers: [FileService],
  exports: [FileService],
})
export class FileModule {}