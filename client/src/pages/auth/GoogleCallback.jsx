import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

const GoogleCallback = () => {
    const { refreshUser } = useAuth();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const handleCallback = async () => {
            const token = searchParams.get("token");
            
            if (token) {
                try {
                    // Even though the cookie is set by the backend, 
                    // we call refreshUser to update the global auth state.
                    await refreshUser();
                    toast.success("Synchronized successfully!");
                    navigate("/dashboard");
                } catch (error) {
                    console.error("Auth sync failed", error);
                    toast.error("Failed to sync profile.");
                    navigate("/login");
                }
            } else {
                toast.error("Authentication failed.");
                navigate("/login");
            }
        };

        handleCallback();
    }, [searchParams, refreshUser, navigate]);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-2xl flex flex-col items-center gap-6">
                <div className="w-16 h-16 bg-violet-600 rounded-2xl flex items-center justify-center shadow-xl shadow-violet-500/30 animate-pulse">
                    <Loader2 className="text-white animate-spin" size={32} />
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tighter mb-2">Synchronizing Profile</h2>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Connecting to Secure Node...</p>
                </div>
            </div>
        </div>
    );
};

export default GoogleCallback;
