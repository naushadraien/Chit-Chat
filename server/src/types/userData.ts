import { User } from 'src/schemas/user.schema';

export type UserData = User & { id: string };
