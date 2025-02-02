import { registerAs } from '@nestjs/config';

export default registerAs('frontend', () => ({
  frontendURL: process.env.FRONTEND_URL,
}));
