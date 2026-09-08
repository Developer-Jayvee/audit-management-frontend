import { useAsync } from '@/hooks/useAsync';
import { getUsers } from '@/services/users/users.service';
import type { User } from '@/services/users/types';

const EMPTY_USERS: User[] = [];

export function useUsers() {
  return useAsync(getUsers, EMPTY_USERS);
}
