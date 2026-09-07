import type { UserType } from "@/common/types/common";


export interface Portal {
  role: UserType;
  name: string;
}

export type LoginStep = 'email' | 'password' | 'done';
