import type { UserData } from '@/common/types/common';

export type User = UserData;

/**
 * A `User` fetched with `?user_type=field_engineer` — the backend eager
 * loads its `field_engineers` profile row so callers can read the id
 * `audit-requests/{id}/assign` actually expects (`field_engineer_id`
 * references `field_engineers.id`, not `users.id`).
 */
export interface FieldEngineerUser extends User {
  field_engineer_profile: { id: number | string } | null;
}

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
