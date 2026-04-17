import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Encendido from "../assets/Encendido.png";
import FunvalBrand from "./FunvalBrand";

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

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  if (!user) return null;

  const meta = getRouteMeta(location.pathname);
  const nombre = user.full_name?.trim() || user.first_name?.trim() || user.email || "Usuario";
  const inicial = nombre.charAt(0).toUpperCase();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white/96 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1600px] items-center justify-between gap-4 px-4 md:px-6">
        <div className="flex min-w-0 items-center gap-5">
          <FunvalBrand
            textColor="text-[var(--color-acc2)]"
            iconClassName="bg-[#eef5ff]"
            imageClassName="h-8 w-8 rounded-full"
          />

          <div className="hidden h-10 w-px bg-slate-200 xl:block" />

          <div className="hidden min-w-0 xl:block">
            <h1 className="truncate text-xl font-semibold text-slate-900">
              {meta.title}
            </h1>
            <p className="truncate text-sm text-slate-500">
              {meta.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
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

          <button
            aria-label="Notificaciones"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
            type="button"
          >
            <span className="material-symbols-rounded text-[20px] leading-none">notifications</span>
          </button>

          <button
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            onClick={logout}
            type="button"
          >
            <img alt="logout" className="h-4 w-4 object-contain" src={Encendido} />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
