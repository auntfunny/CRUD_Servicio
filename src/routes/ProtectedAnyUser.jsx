import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Autenticando from "../components/Autenticando";
import useSession from "../hooks/useSession";
import { useEffect } from "react";
import { useToast } from "../context/ToastContext";

const ProtectedAnyUser = () => {
  const { user, authCheck, logout } = useAuth();
  const { user: checkedUser, notification } = useSession(user);
  const {setToastMensaje} = useToast();

  useEffect(() => {
      if (notification) {
        console.log(notification);
        logout();
        setToastMensaje("Sesión expirada");
      }
    }, [notification]);

  if (!authCheck) return <Autenticando />;
  if (!checkedUser) return <Navigate to="/login" />;
  return <Outlet />;
};

export default ProtectedAnyUser;
