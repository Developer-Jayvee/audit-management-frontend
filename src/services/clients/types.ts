export interface Client {
  id: number | string;
  /** The `client`-role login account that manages this organization, when Admin has linked one (Phase 3.1). Null when unlinked. */
  user_id: number | string | null;
  name: string;
  email: string | null;
  contact_no: string;
  complete_address: string;
  city_id: string | null;
  region_id: string | null;
  is_active: boolean;
}

export interface CreateClientPayload {
  name: string;
  email?: string;
  contact_no: string;
  complete_address: string;
  city_id?: string;
  region_id?: string;
  /** The Client-role login to link this organization to, or null to leave/make it unlinked. */
  user_id?: number | string | null;
}

export type UpdateClientPayload = Partial<CreateClientPayload> & {
  is_active?: boolean;
};
