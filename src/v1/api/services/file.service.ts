import { Injectable } from '@nestjs/common';
import { createHash } from 'crypto';
import { extname, join } from 'path';
import fs from 'fs';
import { resolve } from 'url';
import process from 'process';

@Injectable()
export class FileService {
  async saveByHash (file: Buffer, directory: string, originalName: string) {
    const fileName = createHash('md5').update(file).digest('hex');
    const filePath = join(__dirname, 'static', directory, fileName + extname(originalName));

    await fs.promises.writeFile(filePath, file);

    return resolve(process.env.BASE_URL, join(directory, fileName + extname(originalName)));
  }
}