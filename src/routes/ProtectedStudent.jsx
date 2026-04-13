import { useAuth } from "../context/AuthContext";

const ProtectedStudent = () => {
    const { user } = useAuth();
    if(user.role !== "STUDENT") return <Navigate to="/unauthorized" />
    return <Outlet />
}

export default ProtectedStudent;
