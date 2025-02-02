export const RESOURCE_TYPES = {
  image: 'image',
  video: 'video',
  raw: 'raw',
  auto: 'auto',
} as const;

export const ALLOWED_FORMATS = [
  'jpg',
  'jpeg',
  'png',
  'gif', // images
  'mp4',
  'mov',
  'avi', // videos
  'pdf',
  'doc',
  'docx', // documents
  'xls',
  'xlsx', // excel
] as const;
