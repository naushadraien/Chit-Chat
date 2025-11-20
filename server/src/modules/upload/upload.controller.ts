import {
  Controller,
  Delete,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from 'src/modules/auth/decorators/public.decorator';
import { CloudinaryResult } from './type';
import { UploadService } from './upload.service';
import { ValidateFile } from 'src/common/decorators/file-upload.decorator';
import { ApiExcludeController } from '@nestjs/swagger';

@ApiExcludeController()
@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Public()
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile(ValidateFile())
    file: Express.Multer.File,
  ): Promise<CloudinaryResult> {
    const result = await this.uploadService.uploadFile(file);
    return {
      url: result.url,
      resourceType: result.resourceType,
      format: result.format,
      size: result.size,
      publicId: result.publicId,
    };
  }

  @Public()
  @Delete()
  async deleteFile(@Query('publicId') publicId: string) {
    return await this.uploadService.deleteFile(publicId);
  }

  @Public()
  @Put()
  @UseInterceptors(FileInterceptor('file'))
  async updateFile(
    @Query('publicId') publicId: string,
    @UploadedFile(ValidateFile())
    file: Express.Multer.File,
  ): Promise<CloudinaryResult> {
    const result = await this.uploadService.updateFile(file, publicId);
    return {
      url: result.url,
      resourceType: result.resourceType,
      format: result.format,
      size: result.size,
      publicId: result.publicId,
    };
  }
}
