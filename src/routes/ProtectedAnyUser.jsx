import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedAnyUser = () => {
    const { user } = useAuth();
    if(!user?.role) return <Navigate to="/login" />
    return <Outlet />
}

export default ProtectedAnyUser;
