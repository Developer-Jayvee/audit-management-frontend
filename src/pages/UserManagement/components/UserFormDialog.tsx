import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import type { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/Dialog';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { FieldError } from '@/components/FieldError';
import { createUserSchema, userSchema } from '@/common/types/common';
import { RoleEnum } from '@/common/constants/roles';
import type { User } from '@/services/users/types';

type CreateFormValues = z.infer<typeof createUserSchema>;
type EditFormValues = z.infer<typeof userSchema>;
export type UserFormValues = CreateFormValues | EditFormValues;
type FormValues = UserFormValues;

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** The account being edited, or null when the dialog is creating a new one. */
  user: User | null;
  submitting: boolean;
  onSubmit: (values: FormValues) => Promise<void>;
}

const ROLE_OPTIONS = Object.entries(RoleEnum).map(([value, label]) => ({ value, label }));

/**
 * Single create/edit dialog for User Management — the schema (and whether
 * a password field is shown) switches on whether `user` is set.
 *
 * @param props - {UserFormDialogProps} Open state, the account being edited (if any), and the submit handler.
 * @returns {JSX.Element} The rendered form dialog.
 */
export function UserFormDialog({ open, onOpenChange, user, submitting, onSubmit }: UserFormDialogProps) {
  const isEdit = user !== null;
  const schema = isEdit ? userSchema : createUserSchema;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!open) return;
    reset(
      user
        ? {
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            address: user.address,
            user_type: user.user_type,
          }
        : { user_type: 'client' }
    );
  }, [open, user, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Account' : 'Create Account'}</DialogTitle>
        </DialogHeader>

        <form
          className="flex flex-col gap-4"
          onSubmit={handleSubmit((values) => onSubmit(values))}
        >
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Input placeholder="First name" {...register('first_name')} />
              <FieldError>{errors.first_name?.message}</FieldError>
            </div>
            <div>
              <Input placeholder="Last name" {...register('last_name')} />
              <FieldError>{errors.last_name?.message}</FieldError>
            </div>
          </div>

          <div>
            <Input type="email" placeholder="Email" {...register('email')} />
            <FieldError>{errors.email?.message}</FieldError>
          </div>

          <div>
            <Input placeholder="Address" {...register('address')} />
            <FieldError>{errors.address?.message}</FieldError>
          </div>

          <div>
            <Select options={ROLE_OPTIONS} {...register('user_type')} />
            <FieldError>{errors.user_type?.message}</FieldError>
          </div>

          {!isEdit && (
            <div>
              <Input
                type="password"
                placeholder="Initial password"
                {...register('password' as keyof FormValues)}
              />
              <FieldError>{(errors as typeof errors & { password?: { message?: string } }).password?.message}</FieldError>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="ghost" className="!w-auto px-4" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="!w-auto px-4" loading={submitting}>
              {isEdit ? 'Save Changes' : 'Create Account'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
