import { useAsync } from '@/hooks/useAsync';
import { getAssets } from '@/services/assets/assets.service';
import type { Asset } from '@/services/assets/types';

const EMPTY_ASSETS: Asset[] = [];

export function useAssets() {
  return useAsync(getAssets, EMPTY_ASSETS);
}
