import { AvailablePortals, PortalRoutePaths } from "@/common/constants/portals";
import type { UserType } from "@/common/types/common";
import useAuthVerification from "@/hooks/useAuthVerification";
import localStorageKeys from "@/lib/config/localStorage";
import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";


export default function RedirectRoute() {
    const [userType,setUserType] = useState<UserType|null>(null);
    const isAuthenticated = useAuthVerification();

    useEffect(() => {
        const type = localStorage.getItem(localStorageKeys.userTypeReference)
        if(type && AvailablePortals.includes(type)) {
            setUserType(type as UserType);
        }
    },[])

    if(isAuthenticated === null) {
        return null;
    }

    if(!isAuthenticated) {
        return <Navigate to="/" replace/>
    }

    if(userType === null) {
        return null;
    }

    return <Navigate to={PortalRoutePaths[userType]} replace/>
}