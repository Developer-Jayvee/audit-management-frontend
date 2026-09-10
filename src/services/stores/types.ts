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
  /**
   * The owning client organization. Required for the admin oversight
   * flow's explicit picker; omitted by the Client portal's own form, since
   * the backend always derives and overwrites it from the authenticated
   * Client's own organization (Phase 3.1, per backend-security).
   */
  client_id?: number | string;
  branch_id?: number | string | null;
  name: string;
  email?: string;
  contact_no: string;
}

export type UpdateStorePayload = Partial<CreateStorePayload> & {
  is_active?: boolean;
};
