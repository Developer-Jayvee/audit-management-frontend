import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthProviderHook } from "@/contexts/AuthContextProvider";
import localStorageKeys from "@/lib/config/localStorage";
import { logout as logoutRequest } from "@/services/auth/auth.service";

/**
 * Provides a function that logs the current user out end to end: calls the
 * backend logout endpoint, clears the persisted session from localStorage,
 * resets AuthContext, and sends the user back to the guest-accessible login
 * route. The local session is cleared even if the backend call fails, so a
 * broken connection can't trap the user in a signed-in state — but the
 * failure is surfaced rather than swallowed, since the server-side session
 * stays valid until it naturally expires in that case.
 *
 * @returns {() => Promise<void>} Call to run the full logout flow.
 */
export default function useLogout() {
    const auth = AuthProviderHook();
    const navigate = useNavigate();

    const logout = useCallback(async () => {
        try {
            await logoutRequest();
        } catch {
            console.warn(
                'Logout request to the server failed; the session may still be active on the backend until it expires.'
            );
        }
        localStorage.removeItem(localStorageKeys.authReference);
        localStorage.removeItem(localStorageKeys.userTypeReference);
        auth?.setUser?.(undefined);
        navigate('/', { replace: true });
    }, [auth, navigate]);

    return logout;
}
