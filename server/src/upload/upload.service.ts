import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';
import { CloudinaryResult, ResourceType, UploadOptions } from './type';
import { ALLOWED_FORMATS, RESOURCE_TYPES } from './constants/constants';

@Injectable()
export class UploadService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.getOrThrow('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.getOrThrow('CLOUDINARY_API_KEY'),
      api_secret: this.configService.getOrThrow('CLOUDINARY_API_SECRET'),
    });
  }

  //this private method is also made in utils folder using static keyword
  private getResourceType(mimetype: string): ResourceType {
    if (mimetype.includes('image')) return RESOURCE_TYPES.image;
    if (mimetype.includes('video') || mimetype.includes('audio'))
      return RESOURCE_TYPES.video;
    if (mimetype === 'application/pdf') return RESOURCE_TYPES.auto;
    return RESOURCE_TYPES.raw;
  }

  private getUploadOptions(
    file: Express.Multer.File,
    options?: Partial<UploadOptions>,
  ): UploadApiOptions {
    const resourceType = this.getResourceType(file.mimetype);
    return {
      resource_type: resourceType,
      folder: resourceType === 'auto' ? 'files' : `${resourceType}s`,
      use_filename: true,
      flags: file.mimetype === 'application/pdf' ? 'attachment' : undefined,
      allowed_formats: [...ALLOWED_FORMATS],
      ...options,
    };
  }

  private uploadToCloudinary(
    file: Express.Multer.File,
    options?: Partial<UploadOptions>,
  ): Promise<CloudinaryResult> {
    console.log('🚀 ~ UploadService ~ file:', file);
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        this.getUploadOptions(file, options),
        (error, result) => {
          console.log(
            '🚀 ~ UploadService ~ returnnewPromise ~ result:',
            result,
          );
          console.log('🚀 ~ UploadService ~ returnnewPromise ~ error:', error);
          if (error) return reject(error);
          resolve({
            url: result.url,
            format: result.format,
            resourceType: result.resource_type,
            size: result.bytes,
            publicId: result.public_id,
          });
        },
      );

      upload.end(file.buffer);
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<CloudinaryResult> {
    return this.uploadToCloudinary(file);
  }

  //delete file from cloudinary
  async deleteFile(
    publicId: string,
  ): Promise<{ success: boolean; message: string }> {
    if (!publicId) {
      throw new HttpException('Public ID is required', HttpStatus.BAD_REQUEST);
    }

    try {
      // Get resource type from publicId folder structure
      let resourceType = 'image';
      if (publicId.startsWith('videos/')) resourceType = 'video';
      if (publicId.startsWith('audios/')) resourceType = 'audio';

      const result = await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
      if (result.result !== 'ok') {
        throw new HttpException(
          'Failed to delete file',
          HttpStatus.BAD_REQUEST,
        );
      }
      return {
        success: true,
        message: 'File deleted successfully',
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to delete file',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateFile(
    file: Express.Multer.File,
    publicId: string,
  ): Promise<CloudinaryResult> {
    if (!file || !publicId) {
      throw new HttpException(
        'File and Public ID are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    try {
      // Get resource type from publicId folder structure
      let resourceType = 'image'; // default
      if (publicId.startsWith('videos/')) resourceType = 'video';
      if (publicId.startsWith('audios/')) resourceType = 'audio';
      await cloudinary.uploader.destroy(publicId, {
        resource_type: resourceType,
      });
      return this.uploadToCloudinary(file, {
        publicId,
        overwrite: true,
      });
    } catch (error) {
      throw new HttpException(
        `Failed to update file: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
