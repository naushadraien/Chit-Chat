import { config } from 'dotenv';
import { validateConfig } from './validation/env.validation';

// Load .env file before validation
config();

// Now validate
const parsedEnvs = validateConfig(process.env);

export { parsedEnvs as envs };
