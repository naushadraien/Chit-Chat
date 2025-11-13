import { registerAs } from '@nestjs/config';
import { JwtModuleOptions, JwtSignOptions } from '@nestjs/jwt';
import { envs } from './envs';

export default registerAs(
  'jwt',
  (): JwtModuleOptions => ({
    secret: envs.JWT_SECRET_KEY,
    signOptions: {
      expiresIn: envs.JWT_EXPIRES_IN as JwtSignOptions['expiresIn'],
    },
  }),
);
