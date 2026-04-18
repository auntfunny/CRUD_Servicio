import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import ToastCaja from "../components/ToastCaja";

const ToastContext = createContext();
const MAX_NOTIFICATIONS = 12;

function getRouteContext(pathname) {
  const map = [
    { match: (value) => value === "/", label: "Dashboard" },
    { match: (value) => value === "/usuarios", label: "Usuarios" },
    { match: (value) => value.startsWith("/usuarios/"), label: "Usuarios" },
    { match: (value) => value === "/categorias", label: "Categorias" },
    { match: (value) => value === "/paises", label: "Paises" },
    { match: (value) => value === "/cursos", label: "Cursos" },
    { match: (value) => value === "/reportes", label: "Reportes" },
    { match: (value) => value === "/estudiantes-pendientes", label: "Seguimiento" },
    { match: (value) => value === "/perfil" || value.startsWith("/perfil/"), label: "Perfil" },
    { match: (value) => value === "/cambiarpassword", label: "Seguridad" },
    { match: (value) => value === "/estudiante/dash", label: "Dashboard estudiante" },
    { match: (value) => value === "/estudiante/reportes", label: "Mis reportes" },
    { match: (value) => value === "/login", label: "Acceso" },
  ];

  return map.find((item) => item.match(pathname))?.label ?? "Sistema";
}

function buildToastPayload(input, pathname) {
  if (!input) return null;

  const base = typeof input === "string" ? { message: input } : input;
  const message = base.message ?? base.toastMensaje ?? "";
  if (!message) return null;

  return {
    context: base.context ?? getRouteContext(pathname),
    createdAt: Date.now(),
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    message,
    read: false,
    title: base.title ?? "Actividad reciente",
    tone: base.tone ?? "info",
  };
}

export const ToastProvider = ({ children }) => {
  const location = useLocation();
  const [activeToast, setActiveToast] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [mostrarToast, setMostrarToast] = useState(false);
  const timeoutRef = useRef(null);

  const cerrarToast = () => {
    setMostrarToast(false);
    window.clearTimeout(timeoutRef.current);
  };

  const setToastMensaje = (input) => {
    const payload = buildToastPayload(input, location.pathname);
    if (!payload) return;

    setActiveToast(payload);
    setNotifications((current) => [payload, ...current].slice(0, MAX_NOTIFICATIONS));
    setMostrarToast(true);
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => {
      setMostrarToast(false);
    }, 3200);
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  const markNotificationsAsRead = () => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  };

  useEffect(
    () => () => {
      window.clearTimeout(timeoutRef.current);
    },
    [],
  );

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications],
  );

  return (
    <ToastContext.Provider
      value={{
        clearNotifications,
        markNotificationsAsRead,
        notifications,
        setToastMensaje,
        unreadCount,
        toastMensaje,
      }}
    >
      <ToastCaja
        onClose={cerrarToast}
        toast={activeToast}
        visible={mostrarToast && Boolean(activeToast)}
      />
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);
