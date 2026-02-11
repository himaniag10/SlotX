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

export const adminApi = {
    getStats: () => apiFetch("/api/admin/stats"),
    createSlot: (data) => apiFetch("/api/admin/exam-slots", { method: "POST", body: data }),
    getSlots: () => apiFetch("/api/admin/exam-slots"),
    updateSlot: (id, data) => apiFetch(`/api/admin/exam-slots/${id}`, { method: "PATCH", body: data }),
    deleteSlot: (id) => apiFetch(`/api/admin/exam-slots/${id}`, { method: "DELETE" }),
    toggleSlot: (id) => apiFetch(`/api/admin/exam-slots/${id}/toggle`, { method: "PATCH" }),
    getSlotBookings: (id) => apiFetch(`/api/admin/slots/${id}/bookings`),
    removeBooking: (id) => apiFetch(`/api/admin/bookings/${id}`, { method: "DELETE" }),
    getAuditLogs: () => apiFetch("/api/admin/audit-logs"),
};

export const bookingApi = {
    getStats: () => apiFetch("/api/stats"),
    getActivity: () => apiFetch("/api/activity"),
    getAvailableSlots: () => apiFetch("/api/slots/available"),
    bookSlot: (data) => apiFetch("/api/book-slot", { method: "POST", body: data }),
    getMyBookings: () => apiFetch("/api/my-bookings"),
    cancelBooking: (id) => apiFetch(`/api/cancel-booking/${id}`, { method: "DELETE" }),
};

export const getErrorMessage = (error) => {
    if (axios.isAxiosError(error)) {
        return error.response?.data?.message || error.response?.data?.error || error.message;
    }
    return error instanceof Error ? error.message : "Something went wrong";
};