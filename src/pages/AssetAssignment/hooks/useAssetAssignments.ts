import { useAsync } from '@/hooks/useAsync';
import { getAssetAssignments } from '@/services/assetAssignment/assetAssignment.service';
import type { AssetAssignment } from '@/services/assetAssignment/types';

const EMPTY_ASSIGNMENTS: AssetAssignment[] = [];

export function useAssetAssignments() {
  return useAsync(getAssetAssignments, EMPTY_ASSIGNMENTS);
}
