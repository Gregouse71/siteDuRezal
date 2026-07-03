import axios from "axios";
import { BACKEND_BASE_URL } from "../base_url";

const httpInstance = axios.create({
    baseURL: BACKEND_BASE_URL,
    headers: {
        "Content-Type": "application/json; charset=utf-8",
    },
});

httpInstance.interceptors.request.use(
    (config: any) => {
        const token = localStorage.getItem("rezal-token");
        const auth = token ? `Bearer ${token}` : "";
        config.headers["Authorization"] = auth;
        return config;
    },
    (error) => Promise.reject(error),
);

httpInstance.interceptors.response.use(
    (response: any) => {
        return response;
    },
    (error) => {
        return Promise.reject(error);
    },
);

export default httpInstance;
