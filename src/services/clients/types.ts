export interface Client {
  id: number | string;
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
}

export type UpdateClientPayload = Partial<CreateClientPayload> & {
  is_active?: boolean;
};
