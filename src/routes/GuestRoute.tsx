import useAuthVerification from "@/hooks/useAuthVerification";
import { Navigate, Outlet } from "react-router-dom";


export default function GuestRoute() {
    const isGuest = useAuthVerification();
    
    if(isGuest) {
        return <Navigate to="/redirect" replace/>
    }
    
    return <Outlet/>
}