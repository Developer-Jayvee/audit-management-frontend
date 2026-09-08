import { lazy } from "react";
import { Navigate } from "react-router-dom";
import RoleGuard from "./RoleGuard";

const ClientDashboardPage = lazy(() => import("@/pages/Client/ClientDashboardPage"));

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
];

export default ClientRoutes;
