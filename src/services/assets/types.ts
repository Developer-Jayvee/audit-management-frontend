export interface Asset {
  id: number | string;
  client_id: number | string | null;
  store_id: number | string | null;
  name: string;
  is_active: boolean;
}

export interface CreateAssetPayload {
  name: string;
  client_id?: number | string | null;
  store_id?: number | string | null;
}

export type UpdateAssetPayload = Partial<CreateAssetPayload> & {
  is_active?: boolean;
};
