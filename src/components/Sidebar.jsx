import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FunvalBrand from "./FunvalBrand";

function MaterialIcon({ icon }) {
  return (
    <span className="material-symbols-rounded text-[20px] leading-none">
      {icon}
    </span>
  );
}

export default function Sidebar({ isOpen = false, onClose }) {
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
    <>
      <div
        aria-hidden={!isOpen}
        className={`fixed inset-0 top-20 z-30 bg-slate-950/30 transition duration-300 xl:hidden ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed left-0 top-20 z-40 h-[calc(100dvh-5rem)] w-[17rem] border-r border-slate-200/70 bg-[linear-gradient(180deg,_#f8fafd,_#f4f7fb)] shadow-[0_18px_45px_rgba(15,23,42,0.12)] transition-transform duration-300 ease-out xl:translate-x-0 xl:shadow-none ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200/70 px-4 py-4 xl:hidden">
            <FunvalBrand
              compactOnMobile
              iconClassName="bg-white"
              imageClassName="h-8 w-8 rounded-full"
              textColor="text-[var(--color-acc2)]"
            />
            <button
              aria-label="Cerrar menu"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
              onClick={onClose}
              type="button"
            >
              <span className="material-symbols-rounded text-[20px] leading-none">close</span>
            </button>
          </div>

          <div className="flex min-h-0 flex-1 flex-col px-3 py-4">
            <nav className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
              {menu.map((item) => (
                <NavLink
                  key={`${item.name}-${item.icon}`}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-[1.15rem] px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-[linear-gradient(180deg,_#4f8df7,_#2a6ddd)] text-white shadow-[0_16px_30px_rgba(42,109,221,0.22)]"
                        : "text-slate-500 hover:bg-white hover:text-slate-800"
                    } justify-start`
                  }
                  end={item.path === "/" || item.path === "/estudiante/dash"}
                  onClick={onClose}
                  to={item.path}
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[1rem] transition ${
                          isActive
                            ? "bg-white/14"
                            : "bg-white text-slate-500 shadow-[0_8px_18px_rgba(15,23,42,0.05)]"
                        }`}
                      >
                        <MaterialIcon icon={item.icon} />
                      </span>
                      <span className="max-w-[170px] overflow-hidden whitespace-nowrap opacity-100 transition-all duration-300">
                        {item.name}
                      </span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="mt-4 border-t border-slate-200/70 pt-4">
              <div className="rounded-[1.25rem] border border-slate-200 bg-white/90 px-4 py-3 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  Plataforma
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-800">
                  Horas de servicio
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
