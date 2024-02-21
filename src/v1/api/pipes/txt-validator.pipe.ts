import { Injectable, PipeTransform } from '@nestjs/common';
import { extname } from 'path';
import { DataNotFoundException } from '../../exceptions/data-not-found.exception';
import { InvalidExtensionException } from '../../exceptions/invalid-extension.exception';
import { TooLargeSizeException } from '../../exceptions/too-large-size.exception';

const TXT_MAX_SIZE = 100000;

@Injectable()
export class TxtValidatorPipe implements PipeTransform {
  transform (file: Express.Multer.File) {

    if (!file) throw new DataNotFoundException();

    const ext = extname(file.originalname);

    if (ext !== 'txt') {
      throw new InvalidExtensionException();
    }

    if (file.size > TXT_MAX_SIZE) {
      throw new TooLargeSizeException('100 KB');
    }

    return file;
  }
}