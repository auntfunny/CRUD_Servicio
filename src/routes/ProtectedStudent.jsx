import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedStudent = () => {
    const { user } = useAuth();
    if(!user?.role) return <Navigate to="/login" />
    if(user?.role !== "STUDENT") return <Navigate to="/unauthorized" />
    return <Outlet />
}

export default ProtectedStudent;
