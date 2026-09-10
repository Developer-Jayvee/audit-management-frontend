export interface Branch {
  id: number | string;
  store_id: number | string;
  client_id: number | string;
  complete_address: string;
  region_id: string | null;
  city_id: string | null;
  is_active: boolean;
}

export interface CreateBranchPayload {
  store_id: number | string;
  client_id: number | string;
  complete_address: string;
  region_id?: string;
  city_id?: string;
}

export type UpdateBranchPayload = Partial<CreateBranchPayload> & {
  is_active?: boolean;
};
