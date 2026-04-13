import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedAnyUser = () => {
    const { user } = useAuth();
    if(!user.role) return <Navigate to="/unauthorized" />
    return <Outlet />
}

export default ProtectedAnyUser;
