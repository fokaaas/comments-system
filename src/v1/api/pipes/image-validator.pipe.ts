import { Injectable, PipeTransform } from '@nestjs/common';
import { extname } from 'path';
import { DataNotFoundException } from '../../exceptions/data-not-found.exception';
import { InvalidExtensionException } from '../../exceptions/invalid-extension.exception';
import { TooLargeSizeException } from '../../exceptions/too-large-size.exception';

const IMAGE_MAX_SIZE = 1048576;
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.gif'];

@Injectable()
export class ImageValidatorPipe implements PipeTransform {
  transform (file: Express.Multer.File) {

    if (!file) throw new DataNotFoundException();

    const ext = extname(file.originalname);

    if (!IMAGE_EXTENSIONS.includes(ext)) {
      throw new InvalidExtensionException();
    }

    if (file.size > IMAGE_MAX_SIZE) {
      throw new TooLargeSizeException('1 MB');
    }

    return file;
  }
}