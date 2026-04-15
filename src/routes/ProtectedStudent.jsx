import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Autenticando from "../components/Autenticando";
import { useCookies } from "react-cookie";

const ProtectedStudent = () => {
    const { user, authCheck } = useAuth();
    const [cookies] = useCookies(["token"])
    if(!authCheck) return <Autenticando />
    if(!user?.role || !cookies?.token) return <Navigate to="/login" />
    if(user?.role !== "STUDENT") return <Navigate to="/unauthorized" />
    return <Outlet />
}

export default ProtectedStudent;
