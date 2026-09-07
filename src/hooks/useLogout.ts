import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AuthProviderHook } from "@/contexts/AuthContextProvider";
import { useConfirm } from "@/contexts/ConfirmDialogContext";
import localStorageKeys from "@/lib/config/localStorage";
import { logout as logoutRequest } from "@/services/auth/auth.service";

/**
 * Provides a function that confirms with the user, then logs them out end
 * to end: calls the backend logout endpoint, clears the persisted session
 * from localStorage, resets AuthContext, and sends the user back to the
 * guest-accessible login route. Logging out ends the session immediately —
 * an unexpected side effect per docs/coding-standards.md §3.3 — so it's
 * gated behind the shared confirm dialog rather than firing on the bare
 * click. The local session is cleared even if the backend call fails, so a
 * broken connection can't trap the user in a signed-in state — but the
 * failure is surfaced rather than swallowed, since the server-side session
 * stays valid until it naturally expires in that case.
 *
 * @returns {() => Promise<void>} Call to run the confirm-then-logout flow; resolves once the user has answered and, if confirmed, the logout has completed.
 */
export default function useLogout() {
    const auth = AuthProviderHook();
    const navigate = useNavigate();
    const confirm = useConfirm();

    const logout = useCallback(async () => {
        const confirmed = await confirm({
            title: 'Sign out?',
            description: "You'll be signed out of this session and returned to the login screen.",
            confirmLabel: 'Sign out',
            cancelLabel: 'Cancel',
        });
        if (!confirmed) return;

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
    }, [auth, navigate, confirm]);

    return logout;
}
