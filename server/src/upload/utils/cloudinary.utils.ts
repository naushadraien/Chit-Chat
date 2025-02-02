import { v2 as cloudinary } from 'cloudinary';
import { ResourceType, UploadOptions, CloudinaryResult } from '../type';
import { ALLOWED_FORMATS, RESOURCE_TYPES } from '../constants/constants';

/* 
  
  Plan for Static Methods in Utils Class:
Static methods benefits:

No need to instantiate class
Utility functions are stateless
Direct access to methods
Memory efficient
Better for pure functions


Example without static when using this CloudinaryUtils in other class :
const utils = new CloudinaryUtils();
await utils.uploadToCloudinary(file);


when the method is initialized with static then the class method is used easily as:
await CloudinaryUtils.uploadToCloudinary(file);


Benefits of using static method:
No class instantiation needed
Functions remain pure
Easy to import and use
Better for utility methods
Follows functional programming principles
  */

export class CloudinaryUtils {
  static getResourceType(mimetype: string): ResourceType {
    if (mimetype.includes('image')) return RESOURCE_TYPES.image;
    if (mimetype.includes('video')) return RESOURCE_TYPES.video;
    if (mimetype === 'application/pdf') return RESOURCE_TYPES.auto;
    return RESOURCE_TYPES.raw;
  }

  static getUploadOptions(
    file: Express.Multer.File,
    options?: Partial<UploadOptions>,
  ) {
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

  static uploadToCloudinary(
    file: Express.Multer.File,
    options?: Partial<UploadOptions>,
  ): Promise<CloudinaryResult> {
    return new Promise((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        this.getUploadOptions(file, options),
        (error, result) => {
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
}
