import { Navigate, Outlet } from "react-router-dom";

const ProtectedAdmin = () => {
    const { user } = useAuth();
    if(user.role !== "ADMIN") return <Navigate to="/unauthorized" />
    return <Outlet />
}

export default ProtectedAdmin;
