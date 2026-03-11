import axios from "axios";

export const API_URL = "https://selfdeploy.muthubala.in/api/v1/";

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message =
            error.response?.data?.message ||
            error.response?.data?.detail ||
            "Something went wrong. Please try again.";
        return Promise.reject(new Error(message));
    }
);

export default api;
