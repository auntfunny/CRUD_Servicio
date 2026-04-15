import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Autenticando from "../components/Autenticando";
import useSession from "../hooks/useSession";
import { useEffect } from "react";

const ProtectedAnyUser = () => {
  const { user, authCheck, logout } = useAuth();
  const { user: checkedUser, notification } = useSession(user);

  useEffect(() => {
      if (notification) {
        console.log(notification);
        logout();
        // Envia notification a toast mensajes
      }
    }, [notification]);

  if (!authCheck) return <Autenticando />;
  if (!checkedUser) return <Navigate to="/login" />;
  return <Outlet />;
};

export default ProtectedAnyUser;
