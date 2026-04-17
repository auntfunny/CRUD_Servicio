import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function MaterialIcon({ icon }) {
  return (
    <span className="material-symbols-rounded text-[20px] leading-none">
      {icon}
    </span>
  );
}

export default function Sidebar() {
  const { user } = useAuth();

  if (!user) return null;

  const adminMenu = [
    { name: "Dashboard", path: "/", icon: "dashboard" },
    { name: "Mi Perfil", path: "/perfil", icon: "person" },
    { name: "Usuarios", path: "/usuarios", icon: "group" },
    { name: "Categorias", path: "/categorias", icon: "category" },
    { name: "Paises", path: "/paises", icon: "public" },
    { name: "Cursos", path: "/cursos", icon: "school" },
    { name: "Reportes", path: "/reportes", icon: "assignment" },
  ];

  const studentMenu = [
    { name: "Dashboard", path: "/estudiante/dash", icon: "dashboard" },
    { name: "Mi Perfil", path: "/perfil", icon: "person" },
    { name: "Reportes", path: "/estudiante/reportes", icon: "assignment" },
  ];

  const menu = user.role === "ADMIN" ? adminMenu : studentMenu;

  return (
    <aside
      className="fixed left-0 top-20 z-40 h-[calc(100vh-5rem)] w-[17rem] overflow-hidden bg-[linear-gradient(180deg,_#f5f7fb,_#f8fafc)]"
    >
      <div className="flex h-full flex-col px-3 py-5">
        <nav className="flex flex-1 flex-col gap-2">
          {menu.map((item) => (
            <NavLink
              key={`${item.name}-${item.icon}`}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition ${
                  isActive
                    ? "bg-[linear-gradient(180deg,_#4f8df7,_#2a6ddd)] text-white shadow-[0_16px_30px_rgba(42,109,221,0.22)]"
                    : "text-slate-500 hover:bg-white hover:text-slate-800"
                } justify-start`
              }
              end={item.path === "/" || item.path === "/estudiante/dash"}
              to={item.path}
            >
              {({ isActive }) => (
                <>
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl transition ${isActive ? "bg-white/14" : "bg-white text-slate-500 shadow-[0_8px_18px_rgba(15,23,42,0.05)]"}`}>
                    <MaterialIcon icon={item.icon} />
                  </span>
                  <span className="overflow-hidden whitespace-nowrap transition-all duration-300 max-w-[170px] opacity-100">
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-[1.6rem] border border-slate-200 bg-white p-4 shadow-[0_12px_24px_rgba(15,23,42,0.05)]">
          <p className="overflow-hidden whitespace-nowrap text-xs uppercase tracking-[0.18em] text-slate-400 transition-all duration-300 max-w-[170px] opacity-100">
            Plataforma
          </p>
          <p className="mt-2 overflow-hidden whitespace-nowrap text-sm font-semibold text-slate-800 transition-all duration-300 max-w-[170px] opacity-100">
            Horas de servicio
          </p>
        </div>
      </div>
    </aside>
  );
}
