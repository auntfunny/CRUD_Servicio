
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Sidebar({abierto}) {
  const { user } = useAuth();

  if (!user) return null;

  //Menu administrador
  const adminMenu = [
    { name: "Mi Perfil", path: "/perfil" },
    { name: "Usuarios", path: "/usuarios" },
    { name: "Categorías", path: "/categorias" },
    { name: "Países", path: "/paises" },
    { name: "Reportes", path: "/reportes" },
    { name: "Dashboard", path: "/" },
  ];

  //Menu estudiante
  const studentMenu = [    
    { name: "Mi Perfil", path: "/perfil" },
    { name: "Reportes", path: "/estudiante/reportes" },
    { name: "Dashboard", path: "/estudiante/dash" },
  ];
  
  //escojo el menú
  const menu = user?.role === "ADMIN" ? adminMenu : studentMenu;

  return (
    <div className={`
    fixed top-[50px] right-0 w-34 bg-[#2c5b98] text-white p-4 transform transition-transform duration-300 z-50
    ${abierto ? "translate-x-0" : "translate-x-full"} md:static md:translate-x-0 md:block md:min-h-full md:bg-[radial-gradient(circle_at_top,_#2c5b98_0%,_#183b68_45%,_#0b1f3a_100%)]  `}>
      <ul className="space-y-2">
        {menu.map((item) => (
          <li key={item.name}>
            <Link to={item.path} >{item.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}