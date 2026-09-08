import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import type { UserType } from "@/common/types/common";
import localStorageKeys from "@/lib/config/localStorage";

interface RoleGuardProps {
  allow: UserType[];
  children: ReactNode;
}

/**
 * Restricts a nested `/admin` route to a set of roles, independent of
 * whether it's linked from the nav. Reads the role straight from
 * localStorage (set at login) so a direct URL hit is blocked on the same
 * render as a nav click, not one render later.
 *
 * @param allow - {UserType[]} Roles permitted to view the wrapped route.
 * @param children - {ReactNode} The route element to render when the role is permitted.
 * @returns {ReactNode} The children if permitted, otherwise a redirect to the admin dashboard.
 */
export default function RoleGuard({ allow, children }: RoleGuardProps) {
  const userType = localStorage.getItem(localStorageKeys.userTypeReference) as UserType | null;

  if (!userType || !allow.includes(userType)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}
