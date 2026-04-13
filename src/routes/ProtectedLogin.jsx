import { useAuth } from "../context/AuthContext";

const ProtectedLogin = ({children}) => {
    const { user } = useAuth();
    if(user) {
        if(user.role === "ADMIN"){
            return <Navigate to="/" />
        } else {
            return <Navigate to="/estudiante/dash" />
        }
    } else {
        return children;
    }
}

export default ProtectedLogin;
