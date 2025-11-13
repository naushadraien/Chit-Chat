import { registerAs } from '@nestjs/config';
import { envs } from './envs';

export default registerAs('frontend', () => ({
  frontendURL: envs.FRONTEND_URL,
}));
