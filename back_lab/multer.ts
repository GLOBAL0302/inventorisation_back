import multer from 'multer';
import config from './config';
import path from 'path';
import { promises as fs } from 'node:fs';
import { randomUUID } from 'crypto';

const imageStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const destDir = path.join(config.publicPath, 'images');
    await fs.mkdir(destDir, { recursive: true });
    cb(null, config.publicPath);
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    const newFileName = randomUUID() + extension;
    cb(null, 'images/' + newFileName);
  },
});

export const imagesUpload = multer({ storage: imageStorage });
