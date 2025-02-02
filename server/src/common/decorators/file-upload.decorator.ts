import {
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
} from '@nestjs/common';
import {
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE,
} from 'src/upload/constants/file-validation.constants';

export const ValidateFile = () => {
  return new ParseFilePipe({
    validators: [
      new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
      new FileTypeValidator({ fileType: ALLOWED_FILE_TYPES }),
    ],
  });
};
