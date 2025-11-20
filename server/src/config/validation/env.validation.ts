import { z } from 'zod';

export const zodEnvSchema = z.object({
  // Database
  MONGO_URI: z
    .url({ message: 'MONGO_URI must be a valid URL' })
    .describe('MongoDB connection URI'),

  // Server
  PORT: z
    .string()
    .transform((val) => {
      const parsed = parseInt(val, 10);
      if (isNaN(parsed)) return 4000;
      return parsed;
    })
    .pipe(
      z
        .number()
        .int()
        .positive()
        .min(1)
        .max(65535, { message: 'Port must be between 1 and 65535' }),
    )
    .default(4000)
    .describe('Server port'),

  // JWT
  JWT_SECRET_KEY: z
    .string()
    .min(32, { message: 'JWT secret key must be at least 32 characters' })
    .describe('JWT secret key for signing tokens'),

  JWT_EXPIRES_IN: z
    .string()
    .regex(/^\d+[smhd]$/, {
      message: 'JWT_EXPIRES_IN must be in format like "1h", "7d", "60s", etc.',
    })
    .default('1h')
    .describe('JWT token expiration time'),

  // Refresh Token
  REFRESH_JWT_SECRET_KEY: z
    .string()
    .min(32, {
      message: 'Refresh JWT secret key must be at least 32 characters',
    })
    .describe('Refresh JWT secret key'),

  REFRESH_JWT_EXPIRES_IN: z
    .string()
    .regex(/^\d+[smhd]$/, {
      message:
        'REFRESH_JWT_EXPIRES_IN must be in format like "1h", "7d", "60s", etc.',
    })
    .default('7d')
    .describe('Refresh JWT token expiration time'),

  // Google OAuth
  GOOGLE_CLIENT_ID: z
    .string()
    .min(1, { message: 'Google Client ID is required' })
    .describe('Google OAuth client ID'),

  GOOGLE_CLIENT_SECRET: z
    .string()
    .min(1, { message: 'Google Client Secret is required' })
    .describe('Google OAuth client secret'),

  GOOGLE_CALLBACK_URL: z
    .string()
    .url({ message: 'Google callback URL must be a valid URL' })
    .describe('Google OAuth callback URL'),

  // Frontend
  FRONTEND_URL: z
    .url({ message: 'Frontend URL must be a valid URL' })
    .describe('Frontend application URL'),

  // Email (SMTP)
  SMTP_HOST: z
    .string()
    .min(1, { message: 'SMTP host is required' })
    .describe('SMTP server host'),

  SMTP_PORT: z
    .string()
    .transform((val) => parseInt(val, 10))
    .pipe(
      z
        .number()
        .int()
        .positive()
        .min(1)
        .max(65535, { message: 'SMTP port must be between 1 and 65535' }),
    )
    .describe('SMTP server port'),

  SMTP_USER: z
    .string()
    .min(1, { message: 'SMTP user is required' })
    .describe('SMTP username'),

  SMTP_PASS: z
    .string()
    .min(1, { message: 'SMTP password is required' })
    .describe('SMTP password'),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: z
    .string()
    .min(1, { message: 'Cloudinary cloud name is required' })
    .describe('Cloudinary cloud name'),

  CLOUDINARY_API_KEY: z
    .string()
    .min(1, { message: 'Cloudinary API key is required' })
    .describe('Cloudinary API key'),

  CLOUDINARY_API_SECRET: z
    .string()
    .min(1, { message: 'Cloudinary API secret is required' })
    .describe('Cloudinary API secret'),
});

export type EnvConfig = z.infer<typeof zodEnvSchema>;

export function validateConfig(config: Record<string, unknown>) {
  try {
    return zodEnvSchema.parse(config);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Environment validation errors:');
      error.issues.forEach((err) => {
        console.error(`- ${err.path.join('.')}: ${err.message}`);
      });
    }
    throw new Error(
      'Environment validation failed. Check server logs for details.',
    );
  }
}
