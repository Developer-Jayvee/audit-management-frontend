import useAuthVerification from "@/hooks/useAuthVerification";
import { AppLayout } from "@/components/layouts/AppLayout"
import { Navigate, Outlet, useMatches } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContextProvider";

export default function ProtectedRoutes() {
    const isUserAuthenticated = useAuthVerification();
    const matches = useMatches();
    const currentRoute = matches[matches.length - 1];
    
    if(isUserAuthenticated === null) {
        return null;
    }

    if(!isUserAuthenticated) {
        return <Navigate to="/" replace/>
    }
    return <AuthProvider>
        <AppLayout title={currentRoute?.handle?.title ?? ""}>
            <Outlet/>
        </AppLayout>
    </AuthProvider> 
}