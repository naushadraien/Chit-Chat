import { RESOURCE_TYPES } from './constants/constants';

export interface CloudinaryResult {
  url: string;
  resourceType: string;
  format: string;
  size: number;
  publicId: string;
}

export type ResourceType = (typeof RESOURCE_TYPES)[keyof typeof RESOURCE_TYPES];

export interface UploadOptions {
  resourceType: ResourceType;
  publicId?: string;
  overwrite?: boolean;
}
