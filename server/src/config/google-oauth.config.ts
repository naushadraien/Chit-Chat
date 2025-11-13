import { registerAs } from '@nestjs/config';
import { envs } from './envs';

export default registerAs('googleOAuth', () => ({
  clientID: envs.GOOGLE_CLIENT_ID,
  clientSecret: envs.GOOGLE_CLIENT_SECRET,
  callbackURL: envs.GOOGLE_CALLBACK_URL,
}));
