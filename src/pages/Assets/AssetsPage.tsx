import { AssetsTable } from './components/AssetsTable';
import { useAssets } from './hooks/useAssets';

export default function AssetsPage() {
  const { data, loading, error } = useAssets();

  return (
      <AssetsTable assets={data} loading={loading} error={error} />
  );
}
