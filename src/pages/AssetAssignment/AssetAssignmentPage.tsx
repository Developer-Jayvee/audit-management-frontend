import { AssignmentsTable } from './components/AssignmentsTable';
import { useAssetAssignments } from './hooks/useAssetAssignments';

export default function AssetAssignmentPage() {
  const { data, loading, error } = useAssetAssignments();

  return (
      <AssignmentsTable assignments={data} loading={loading} error={error} />
  );
}
