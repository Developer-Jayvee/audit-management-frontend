import { checkAuth } from "@/services/auth/auth.service";
import { useEffect, useState } from "react";


export default function useAuthVerification(){
    const [isAuthenticated,setIsAuthenticated] = useState<boolean | null>(null);
    useEffect(() => {
        const verifyUser = async () => {
            setIsAuthenticated(
                await checkAuth()
            );            
        }
        verifyUser();
    },[])

    return isAuthenticated;
}