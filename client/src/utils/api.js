import axios from "axios";

const isProd = process.env.NODE_ENV === "production";

const API_BASE = isProd
    ? process.env.REACT_APP_API_BACKEND_SERVER_URL
    : process.env.REACT_APP_API_BACKEND_LOCAL_URL;

if (!API_BASE) {
    throw new Error("API base URL is not defined");
}

export const api = axios.create({
    baseURL: API_BASE,
    withCredentials: true,
});

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        return Promise.reject(error);
    }
);

export const apiFetch = async (endpoint, options = {}) => {
    const { method = "GET", headers = {}, body } = options;

    const response = await api.request({
        url: endpoint,
        method,
        headers: headers,
        data: body,
    });

    return response.data;
};

export const authApi = {
    register: (data) => apiFetch("/api/auth/register", { method: "POST", body: data }),
    login: (data) => apiFetch("/api/auth/login", { method: "POST", body: data }),
    logout: () => apiFetch("/api/auth/logout", { method: "POST" }),
    getMe: () => apiFetch("/api/auth/me"),
};



export const getErrorMessage = (error) => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || error.response?.data?.error || error.message;
    }
    return error instanceof Error ? error.message : "Something went wrong";
};