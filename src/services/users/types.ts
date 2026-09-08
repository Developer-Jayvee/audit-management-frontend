import type { UserData } from '@/common/types/common';

export type User = UserData;

export interface CreateUserPayload {
  first_name: string;
  last_name: string;
  email: string;
  address: string;
  user_type: User['user_type'];
  password: string;
}

export type UpdateUserPayload = Partial<Omit<CreateUserPayload, 'password'>> & {
  password?: string;
  is_active?: boolean;
};
