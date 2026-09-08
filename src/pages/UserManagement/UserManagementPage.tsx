import { useState } from 'react';
import { Button } from '@/components/Button';
import { useConfirm } from '@/contexts/ConfirmDialogContext';
import { createUser, setUserActive, updateUser } from '@/services/users/users.service';
import type { User } from '@/services/users/types';
import { UsersTable } from './components/UsersTable';
import { UserFormDialog, type UserFormValues } from './components/UserFormDialog';
import { useUsers } from './hooks/useUsers';

export default function UserManagementPage() {
  const { data: users, loading, error, refetch } = useUsers();
  const confirm = useConfirm();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function openCreateDialog() {
    setEditingUser(null);
    setDialogOpen(true);
  }

  function openEditDialog(user: User) {
    setEditingUser(user);
    setDialogOpen(true);
  }

  async function handleSubmit(values: UserFormValues) {
    setSubmitting(true);
    try {
      if (editingUser) {
        await updateUser(editingUser.id, values);
      } else {
        await createUser(values as Parameters<typeof createUser>[0]);
      }
      setDialogOpen(false);
      await refetch();
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleActive(user: User) {
    const activating = !user.is_active;
    const confirmed = await confirm({
      title: activating ? 'Reactivate this account?' : 'Deactivate this account?',
      description: activating
        ? `${user.first_name} ${user.last_name} will regain access immediately.`
        : `${user.first_name} ${user.last_name} will lose access immediately, including any active session.`,
      confirmLabel: activating ? 'Reactivate' : 'Deactivate',
      variant: activating ? 'default' : 'destructive',
    });
    if (!confirmed) return;

    await setUserActive(user.id, activating);
    await refetch();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button className="!w-auto px-5" onClick={openCreateDialog}>
          New Account
        </Button>
      </div>

      <UsersTable
        users={users}
        loading={loading}
        error={error}
        onEdit={openEditDialog}
        onToggleActive={handleToggleActive}
      />

      <UserFormDialog
        // Forces a fresh mount per logical dialog instance (create, or edit
        // of a given user) instead of reusing one Dialog root and toggling
        // its props — reusing it let a fast create -> edit -> save sequence
        // open the next dialog before Radix had fully unmounted the last
        // one's portal, leaving a stray overlay that blocked all clicks.
        key={editingUser?.id ?? 'create'}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        user={editingUser}
        submitting={submitting}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
