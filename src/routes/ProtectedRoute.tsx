import useAuthVerification from "@/hooks/useAuthVerification";
import { AppLayout } from "@/components/layouts/AppLayout"
import { Navigate, Outlet, useMatches } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContextProvider";
import type { UserType } from "@/common/types/common";
import localStorageKeys from "@/lib/config/localStorage";

export default function ProtectedRoutes() {
    const isUserAuthenticated = useAuthVerification();
    const matches = useMatches();
    // react-router's `handle` is untyped (`unknown`) by design — each route
    // sets its own shape via `handle: { title: ... }`, so it's cast here
    // rather than at every route definition.
    const currentRoute = matches[matches.length - 1] as { handle?: { title?: string } } | undefined;
    const userType = localStorage.getItem(localStorageKeys.userTypeReference) as UserType | null;

    if(isUserAuthenticated === null) {
        return null;
    }

    if(!isUserAuthenticated) {
        return <Navigate to="/" replace/>
    }
    return <AuthProvider>
        <AppLayout title={currentRoute?.handle?.title ?? ""} userType={userType}>
            <Outlet/>
        </AppLayout>
    </AuthProvider>
}