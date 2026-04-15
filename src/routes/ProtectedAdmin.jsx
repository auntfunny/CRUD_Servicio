import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedAdmin = () => {
    const { user } = useAuth();
    if(!user?.role) return <Navigate to="/login" />
    if(user?.role !== "ADMIN") return <Navigate to="/unauthorized" />
    return <Outlet />
}

export default ProtectedAdmin;
