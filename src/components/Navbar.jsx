import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import FunvalBrand from "./FunvalBrand";
import { useEffect } from "react";

const routeMeta = [
  {
    match: (pathname) => pathname === "/",
    subtitle: "Resumen general del sistema",
    title: "Horas de servicio",
  },
  {
    match: (pathname) => pathname === "/reportes",
    subtitle: "Revision y gestion administrativa",
    title: "Reportes",
  },
  {
    match: (pathname) => pathname === "/usuarios",
    subtitle: "Gestion y control de usuarios",
    title: "Usuarios",
  },
  {
    match: (pathname) => pathname === "/usuarios/crear",
    subtitle: "Registro de nuevos usuarios",
    title: "Usuarios",
  },
  {
    match: (pathname) => pathname === "/usuarios/import",
    subtitle: "Importacion y exportacion masiva",
    title: "Usuarios",
  },
  {
    match: (pathname) => pathname === "/categorias",
    subtitle: "Organizacion de categorias activas",
    title: "Categorias",
  },
  {
    match: (pathname) => pathname === "/paises",
    subtitle: "Gestion de paises disponibles",
    title: "Paises",
  },
  {
    match: (pathname) => pathname === "/cursos",
    subtitle: "Configuracion de cursos del sistema",
    title: "Cursos",
  },
  {
    match: (pathname) => pathname === "/estudiantes-pendientes",
    subtitle: "Seguimiento de horas pendientes",
    title: "Estudiantes en deuda",
  },
  {
    match: (pathname) => pathname === "/estudiante/dash",
    subtitle: "Resumen de progreso y reportes",
    title: "Horas de servicio",
  },
  {
    match: (pathname) => pathname === "/estudiante/reportes",
    subtitle: "Consulta y registro de reportes",
    title: "Reportes",
  },
  {
    match: (pathname) => pathname === "/perfil",
    subtitle: "Informacion personal de tu cuenta",
    title: "Perfil",
  },
  {
    match: (pathname) => pathname === "/perfil/editar",
    subtitle: "Edicion de datos personales",
    title: "Perfil",
  },
  {
    match: (pathname) => pathname === "/cambiarpassword",
    subtitle: "Actualizacion de acceso y seguridad",
    title: "Seguridad",
  },
];

function getRouteMeta(pathname) {
  return routeMeta.find((item) => item.match(pathname)) ?? {
    title: "Horas de servicio",
    subtitle: "",
  };
}

export default function Navbar({ isSidebarOpen = false, onToggleSidebar }) {
  const { user, logout } = useAuth();
  const {
    clearNotifications,
    markNotificationsAsRead,
    notifications,
    unreadCount,
  } = useToast();
  const location = useLocation();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef(null);

  if (!user) return null;

  const meta = getRouteMeta(location.pathname);
  const nombre = user.full_name?.trim() || user.first_name?.trim() || user.email || "Usuario";
  const inicial = nombre.charAt(0).toUpperCase();
  const recentNotifications = notifications.slice(0, 6);

  useEffect(() => {
    if (!isNotificationOpen) return undefined;

    const handleClickOutside = (event) => {
      if (!notificationRef.current?.contains(event.target)) {
        setIsNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isNotificationOpen]);

  const formatearHora = useMemo(
    () =>
      new Intl.DateTimeFormat("es-EC", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [],
  );

  const toggleNotifications = () => {
    setIsNotificationOpen((current) => {
      const nextValue = !current;
      if (nextValue) {
        markNotificationsAsRead();
      }
      return nextValue;
    });
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/96 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between gap-3 px-4 sm:gap-4 md:px-6">
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <button
            aria-label={isSidebarOpen ? "Cerrar menu" : "Abrir menu"}
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-800 lg:hidden"
            onClick={onToggleSidebar}
            type="button"
          >
            <span className="material-symbols-rounded text-[22px] leading-none">
              {isSidebarOpen ? "close" : "menu"}
            </span>
          </button>

          <FunvalBrand
            compactOnMobile
            textColor="text-[var(--color-acc2)]"
            iconClassName="bg-[#eef5ff]"
            imageClassName="h-8 w-8 rounded-full"
          />

          <div className="hidden h-10 w-px bg-slate-200 lg:block xl:block" />

          <div className="hidden min-w-0 md:block">
            <h1 className="truncate text-lg font-semibold text-slate-900 xl:text-xl">
              {meta.title}
            </h1>
            <p className="truncate text-sm text-slate-500">
              {meta.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            className="hidden items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2.5 transition hover:bg-white md:inline-flex"
            to="/perfil"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(180deg,_#2f80ed,_#195ec9)] text-sm font-bold text-white">
              {inicial}
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-slate-800">{nombre}</p>
              <p className="text-xs text-slate-400">
                {user.role === "ADMIN" ? "Administrador" : "Estudiante"}
              </p>
            </div>
          </Link>

          <div className="relative" ref={notificationRef}>
            <button
              aria-label="Notificaciones"
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
              onClick={toggleNotifications}
              type="button"
            >
              <span className="material-symbols-rounded text-[20px] leading-none">notifications</span>
              {unreadCount > 0 ? (
                <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-rose-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              ) : null}
            </button>

            <div
              className={`absolute right-0 top-[calc(100%+0.75rem)] z-[90] w-[min(24rem,calc(100vw-2rem))] rounded-[1.5rem] border border-slate-200 bg-white p-3 shadow-[0_22px_45px_rgba(15,23,42,0.16)] transition duration-200 ${
                isNotificationOpen ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0"
              }`}
            >
              <div className="flex items-center justify-between gap-3 px-2 pb-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">Notificaciones</p>
                  <p className="text-xs text-slate-400">
                    {notifications.length > 0 ? `${notifications.length} actividad(es) reciente(s)` : "Sin actividad reciente"}
                  </p>
                </div>

                {notifications.length > 0 ? (
                  <button
                    className="text-xs font-semibold text-[var(--color-acc1)] transition hover:opacity-80"
                    onClick={clearNotifications}
                    type="button"
                  >
                    Limpiar
                  </button>
                ) : null}
              </div>

              {recentNotifications.length > 0 ? (
                <div className="max-h-[24rem] space-y-2 overflow-y-auto pr-1">
                  {recentNotifications.map((item) => (
                    <article
                      className="rounded-[1.1rem] border border-slate-100 bg-slate-50/70 px-3 py-3"
                      key={item.id}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-800">
                            {item.title}
                          </p>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {item.message}
                          </p>
                        </div>
                        <span className="shrink-0 text-[11px] font-medium text-slate-400">
                          {formatearHora.format(item.createdAt)}
                        </span>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="rounded-full bg-white px-2 py-1 text-[11px] font-medium text-slate-400">
                          {item.context}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              ) : (
                <div className="rounded-[1.2rem] border border-dashed border-slate-200 bg-slate-50/60 px-4 py-8 text-center text-sm text-slate-500">
                  Tus avisos van a aparecer aquí.
                </div>
              )}
            </div>
          </div>

          <button
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50 sm:px-4"
            onClick={logout}
            type="button"
          >
            <span className="material-symbols-rounded text-[18px] leading-none text-slate-500">
              logout
            </span>
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
