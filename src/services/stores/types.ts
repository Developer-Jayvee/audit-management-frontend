export interface Store {
  id: number | string;
  client_id: number | string;
  branch_id: number | string | null;
  name: string;
  email: string | null;
  contact_no: string | null;
  is_active: boolean;
}

export interface CreateStorePayload {
  client_id: number | string;
  branch_id?: number | string | null;
  name: string;
  email?: string;
  contact_no: string;
}

export type UpdateStorePayload = Partial<CreateStorePayload> & {
  is_active?: boolean;
};
