import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Autenticando from "../components/Autenticando";

const ProtectedAnyUser = () => {
    const { user, authCheck } = useAuth();
    if(!authCheck) return <Autenticando />
    if(!user?.role) return <Navigate to="/login" />
    return <Outlet />
}

export default ProtectedAnyUser;
