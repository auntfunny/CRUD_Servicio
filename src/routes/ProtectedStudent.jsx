import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Autenticando from "../components/Autenticando";

const ProtectedStudent = () => {
    const { user, authCheck } = useAuth();
    if(!authCheck) return <Autenticando />
    if(!user?.role) return <Navigate to="/login" />
    if(user?.role !== "STUDENT") return <Navigate to="/unauthorized" />
    return <Outlet />
}

export default ProtectedStudent;
