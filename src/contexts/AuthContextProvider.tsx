import type { UserData } from "@/common/types/common";
import localStorageKeys from "@/lib/config/localStorage";
import { createContext, useContext, useEffect, useMemo, useState, type Dispatch, type SetStateAction } from "react";

interface AuthContextProvider  {
    user ?: UserData;
    setUser ?: Dispatch<SetStateAction<UserData|undefined>>;
}
export const AuthContext = createContext<AuthContextProvider | null>(null);

export const AuthProviderHook = () => {
    const context = useContext(AuthContext);

    if(context === null) {
        console.warn('Auth Context is out of scope.');
        return;
    }
    return context;
}
export const AuthProvider = ({
    children
} :{
    children : React.ReactNode,

}) => {
    const [authDetails,setAuthDetails] = useState<UserData|undefined>();
    const [authToken,] = useState<undefined|string>(
        localStorage.getItem(localStorageKeys.authReference) ?? undefined  
    );

    useEffect(() => {
        if(authToken) {
            setAuthDetails(
                JSON.parse(authToken)
            );
        }
    },[authToken])
    const provide = useMemo<AuthContextProvider>(() => ({
        user : authDetails,
        setUser : setAuthDetails
    }),[authDetails]);
    
    return <AuthContext.Provider value={provide}>
        {children}
    </AuthContext.Provider>
}