import { User } from 'src/database/schemas/user.schema';

export type UserData = User & { id: string };
