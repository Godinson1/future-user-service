import { FileTypeValidator } from '@nestjs/common';

export const photoTypeValidator = {
  userAvatar: [new FileTypeValidator({ fileType: 'image/png' })],
};

export const getS3Url = (bucket: string, key: string): string => {
  return `https://${bucket}.s3.amazonaws.com/${key}`;
};

export const getFileName = (fileName: string, mimetype: string): string => {
  return `${Date.now()}-future-${fileName}.${mimetype.split('/')[1]}`;
};
