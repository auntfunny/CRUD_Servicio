import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return <h2>Cargando...</h2>;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  //SOLO validar si hay roles definidos
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <h2>No autorizado</h2>;
  }

  return <Outlet />;
}