import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCookies } from "react-cookie";

const ProtectedLogin = ({children}) => {
    const { user } = useAuth();
    const [cookies] = useCookies(["token"])
    if(user?.role && cookies?.token) {
        if(user?.role === "ADMIN"){
            return <Navigate to="/" />
        } else {
            return <Navigate to="/estudiante/dash" />
        }
    } else {
        return children;
    }
}

export default ProtectedLogin;
