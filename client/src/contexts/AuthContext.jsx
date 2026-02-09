import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const refreshUser = async () => {
        try {
            const me = await apiFetch("/api/auth/me");
            setUser(me);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    const login = async (data) => {
        await apiFetch("/api/auth/login", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" }
        });
        await refreshUser();
        if (user) {
            navigate("/dashboard");
        }
    };

    const register = async (data) => {
        await apiFetch("/api/auth/register", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" }
        });
        await refreshUser();
        if (user) {
            navigate("/dashboard");
        }
    };

    const logout = async () => {
        try {
            await apiFetch("/api/auth/logout", { method: "POST" });
        } catch (error) {
            console.error("Logout failed", error);
        }
        setUser(null);
        navigate("/login");
        toast.success("Logged out successfully!");
    };

    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isLoggedIn: !!user, loading, refreshUser, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
};