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
const AuditRequestsPage = lazy(
  () => import("@/pages/AuditRequests/AuditRequestsPage"),
);
const FieldAuditsPage = lazy(
  () => import("@/pages/FieldAudits/FieldAuditsPage"),
);
const FindingsReviewPage = lazy(
  () => import("@/pages/FindingsReview/FindingsReviewPage"),
);
const TicketsPage = lazy(() => import("@/pages/Tickets/TicketsPage"));

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
  {
    path: "audit/requests",
    element: (
      <RoleGuard allow={["admin", "auditor"]}>
        <AuditRequestsPage />
      </RoleGuard>
    ),
    handle: { title: "Audit Requests" },
  },
  {
    path: "audit/field-audits",
    element: (
      <RoleGuard allow={["admin", "auditor"]}>
        <FieldAuditsPage />
      </RoleGuard>
    ),
    handle: { title: "Field Audits" },
  },
  {
    path: "audit/findings",
    element: (
      <RoleGuard allow={["admin", "auditor"]}>
        <FindingsReviewPage />
      </RoleGuard>
    ),
    handle: { title: "Findings Review" },
  },
  {
    path: "audit/tickets",
    element: (
      <RoleGuard allow={["admin", "auditor"]}>
        <TicketsPage />
      </RoleGuard>
    ),
    handle: { title: "Tickets" },
  },
];

export default AdminRoutes;
