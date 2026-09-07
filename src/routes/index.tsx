import { lazy } from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import AdminRoutes from "./admin.routes";
import GuestRoute from "./GuestRoute";
import ClientRoutes from "./client.routes";
import RedirectRoute from "./RedirectRoute";

const LoginPage = lazy(() => import('@/pages/Login/LoginPage'));
const ProtectedRoutes = lazy(() => import("./ProtectedRoute"));


const Routes = createBrowserRouter([
    {
        path:"/",
        element: <GuestRoute/>,
        children:[
            {
                index:true,
                element: <Navigate to="login" replace/>
            },
            {
                path:'login',
                element:  <LoginPage/>
            }
        ]
    },
    {
        path:'/redirect',
        element: <RedirectRoute/>
    },
    {
        path:"/admin",
        element: <ProtectedRoutes/>,
        children: AdminRoutes
    },
    {
        path: "/client",
        element: <ProtectedRoutes/>,
        children: ClientRoutes
    }
]);

export default Routes;