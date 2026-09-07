import httpClient from "@/lib/axios"
import type { PostLoginEmail } from "./types";
import axios from "axios";
import type { DefaultResponse, UserData, UserType } from "@/common/types/common";

const verfiyEmailURL = 'auth/verify-email';
const userLogin = 'auth/login';
const isAuthenticatedURL = 'auth/validate';

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