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
  /**
   * The owning client organization. Required for the admin oversight
   * flow (derived from the chosen store, see `BranchFormDialog`); omitted
   * by the Client portal's own form, since the backend always derives and
   * overwrites it from the authenticated Client's own organization
   * (Phase 3.1, per backend-security).
   */
  client_id?: number | string;
  complete_address: string;
  region_id?: string;
  city_id?: string;
}

export type UpdateBranchPayload = Partial<CreateBranchPayload> & {
  is_active?: boolean;
};
