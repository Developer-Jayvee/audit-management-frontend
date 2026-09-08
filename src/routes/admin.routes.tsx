import { lazy } from "react";
import { Navigate } from "react-router-dom";
import RoleGuard from "./RoleGuard";

const   DashboardPage = lazy(() => import("@/pages/Dashboard/DashboardPage"));
const AssetsPage = lazy(() => import("@/pages/Assets/AssetsPage"));
const AssetAssignmentPage = lazy(
  () => import("@/pages/AssetAssignment/AssetAssignmentPage"),
);

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
];

export default AdminRoutes;
