import { Navigate } from "react-router-dom";

const ProtectedAnyUser = () => {
    const user ="";
    if(!user.role) return <Navigate to="/unauthorized" />
    return <Outlet />
}

export default ProtectedAnyUser;
