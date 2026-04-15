
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Sidebar({abierto}) {
  const { role } = useAuth();

  if (!role) return null;

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
  const menu = role === "ADMIN" ? adminMenu : studentMenu;

  return (
    <div className={`${abierto ? "block" : "hidden"} md:block`}>
      <ul>
        {menu.map((item) => (
          <li key={item.name}>
            <Link to={item.path}>{item.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}