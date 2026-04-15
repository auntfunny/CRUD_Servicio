import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Autenticando from "../components/Autenticando";
import useSession from "../hooks/useSession";
import { useEffectEvent } from "react";

const ProtectedAdmin = () => {
  const { user, authCheck } = useAuth();
  const { user: checkedUser, notification } = useSession(user);
  useEffectEvent(() => {
    if (notification) {
      console.log(notification);
      //Envia notification a toast mensajes
    }
  }, [notification]);
  if (!authCheck) return <Autenticando />;
  if (!checkedUser) return <Navigate to="/login" />;
  if (checkedUser.role !== "ADMIN") return <Navigate to="/unauthorized" />;
  return <Outlet />;
};

export default ProtectedAdmin;
