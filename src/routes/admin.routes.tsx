import { lazy } from "react";
import { Navigate } from "react-router-dom";
import RoleGuard from "./RoleGuard";

const   DashboardPage = lazy(() => import("@/pages/Dashboard/DashboardPage"));
const AssetsPage = lazy(() => import("@/pages/Assets/AssetsPage"));
const AssetAssignmentPage = lazy(
  () => import("@/pages/AssetAssignment/AssetAssignmentPage"),
);
const UserManagementPage = lazy(
  () => import("@/pages/UserManagement/UserManagementPage"),
);
const ClientsPage = lazy(() => import("@/pages/Clients/ClientsPage"));
const StoresPage = lazy(() => import("@/pages/Stores/StoresPage"));
const BranchesPage = lazy(() => import("@/pages/Branches/BranchesPage"));
const ComingSoonPage = lazy(() => import("@/pages/ComingSoon/ComingSoonPage"));

// Phase 2.1 nav-shell stub routes: no feature code yet, just the route/RBAC
// boundary each module will be built behind in 2.5.
const AUDIT_MANAGEMENT_STUBS = [
  { path: "audit/requests", title: "Audit Requests" },
  { path: "audit/field-audits", title: "Field Audits" },
  { path: "audit/findings", title: "Findings Review" },
  { path: "audit/tickets", title: "Tickets" },
];

const AdminRoutes = [
  {
    index: true,
    element: <Navigate to="dashboard" replace />,
  },
  {
    path: "dashboard",
    element: <DashboardPage />,
    handle: {
      title: "Dashboard",
    },
  },
  {
    path: "users",
    element: (
      <RoleGuard allow={["admin"]}>
        <UserManagementPage />
      </RoleGuard>
    ),
    handle: {
      title: "User Management",
    },
  },
  {
    path: "assets",
    element: (
      <RoleGuard allow={["admin"]}>
        <AssetsPage />
      </RoleGuard>
    ),
    handle: {
      title: "Assets",
    },
  },
  {
    path: "assets/assignment",
    element: (
      <RoleGuard allow={["admin"]}>
        <AssetAssignmentPage />
      </RoleGuard>
    ),
    handle: {
      title : "Asset Assignment"
    }
  },
  {
    path: "clients",
    element: (
      <RoleGuard allow={["admin"]}>
        <ClientsPage />
      </RoleGuard>
    ),
    handle: {
      title: "All Clients",
    },
  },
  {
    path: "clients/stores",
    element: (
      <RoleGuard allow={["admin"]}>
        <StoresPage />
      </RoleGuard>
    ),
    handle: {
      title: "All Stores",
    },
  },
  {
    path: "clients/branches",
    element: (
      <RoleGuard allow={["admin"]}>
        <BranchesPage />
      </RoleGuard>
    ),
    handle: {
      title: "All Branches",
    },
  },
  ...AUDIT_MANAGEMENT_STUBS.map(({ path, title }) => ({
    path,
    element: (
      <RoleGuard allow={["admin", "auditor"]}>
        <ComingSoonPage description={`${title} is built in Phase 2.5.`} />
      </RoleGuard>
    ),
    handle: { title },
  })),
];

export default AdminRoutes;
