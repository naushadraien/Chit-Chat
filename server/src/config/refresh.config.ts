import { registerAs } from '@nestjs/config';
import { JwtSignOptions } from '@nestjs/jwt';
import { envs } from './envs';

export default registerAs(
  'refresh-jwt',
  (): JwtSignOptions => ({
    secret: envs.REFRESH_JWT_SECRET_KEY,
    expiresIn: envs.REFRESH_JWT_EXPIRES_IN as JwtSignOptions['expiresIn'],
  }),
);
