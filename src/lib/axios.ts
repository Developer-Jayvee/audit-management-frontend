import { env } from "@/lib/config/env";
import axios from "axios";


const httpClient = axios.create({
    baseURL: env.apiUrl,
    headers: {
        'Accept':'application/json'
    },
    timeout:8000,
    withCredentials:true
});

httpClient.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error)
);
httpClient.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
)

export default httpClient;

