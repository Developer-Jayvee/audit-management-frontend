import { lazy } from "react";
import { Navigate } from "react-router-dom";

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
    element: <AssetsPage />,
    handle: {
      title: "Assets",
    },
  },
  {
    path: "assets/assignment",
    element: <AssetAssignmentPage />,
    handle: {
      title : "Asset Assignment"
    }
  },
];

export default AdminRoutes;
