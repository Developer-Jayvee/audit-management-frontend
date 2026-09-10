import { lazy } from "react";
import { Navigate } from "react-router-dom";
import RoleGuard from "./RoleGuard";

const ClientDashboardPage = lazy(() => import("@/pages/Client/ClientDashboardPage"));
const MyStoresPage = lazy(() => import("@/pages/Client/MyStores/MyStoresPage"));
const MyBranchesPage = lazy(() => import("@/pages/Client/MyBranches/MyBranchesPage"));

const ClientRoutes = [
  {
    index: true,
    element: <Navigate to="dashboard" replace />,
  },
  {
    path: "dashboard",
    element: (
      <RoleGuard allow={["client"]} redirectTo="/redirect">
        <ClientDashboardPage />
      </RoleGuard>
    ),
    handle: {
      title: "Dashboard",
    },
  },
  {
    path: "stores",
    element: (
      <RoleGuard allow={["client"]} redirectTo="/redirect">
        <MyStoresPage />
      </RoleGuard>
    ),
    handle: {
      title: "My Stores",
    },
  },
  {
    path: "branches",
    element: (
      <RoleGuard allow={["client"]} redirectTo="/redirect">
        <MyBranchesPage />
      </RoleGuard>
    ),
    handle: {
      title: "My Branches",
    },
  },
];

export default ClientRoutes;
