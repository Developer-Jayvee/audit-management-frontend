import httpClient from "@/lib/axios"
import type { PostLoginEmail } from "./types";
import axios from "axios";
import type { DefaultResponse, UserData, UserType } from "@/common/types/common";

const verfiyEmailURL = 'auth/verify-email';
const userLogin = 'auth/login';
const isAuthenticatedURL = 'auth/validate';
const logoutURL = 'auth/logout';

export const emailLogin = async ({ email } : PostLoginEmail) => {
    await getCSRFToken();
    const data  = {
        email: email
    }
    const response = await httpClient.post<DefaultResponse<UserType>>(verfiyEmailURL,{
        ...data
    });
    return response;
}

export const postLogin = async (password : string) => {
    const data = {
        password
    }
    const response = await httpClient.post<DefaultResponse<UserData>>(userLogin,{
        ...data
    })
    return response
}

export const getCSRFToken = async () => {
    const baseUrl = import.meta.env.VITE_BASE_URL;
    await axios.get(`${baseUrl}/sanctum/csrf-cookie`);
}

export const checkAuth = async () => {
    try {
        await httpClient.get(isAuthenticatedURL);
        return true;
    } catch (error) {
        return false;
    }

}

/**
 * Ends the current user's session on the backend (invalidates the Sanctum session).
 * Rejects if the request fails so callers can tell a confirmed logout apart
 * from one they only cleared client-side.
 *
 * @returns {Promise<void>} Resolves once the backend confirms the session is invalidated.
 */
export const logout = async () => {
    await httpClient.get(logoutURL);
}