import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, role, logout } = useAuth();

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-[#003A5D] text-white shadow-md">
      
      {/* IZQUIERDA */}
      <h1 className="text-xl font-semibold tracking-wide text-[#FF9E1B] font-title">
        Crud-Servicio
      </h1>

      {/* DERECHA */}
      <div className="flex items-center gap-4 font-body">
        
        <span className="text-sm">
          👤 {user?.id || "Usuario"} | 
          <span className="ml-1 font-semibold text-[#307FE2]">
            {role}
          </span>
        </span>

        <button
          onClick={logout}
          className="bg-[#FF9E1B] hover:bg-[#e68917] text-[#003A5D] font-semibold px-3 py-1 rounded transition duration-200"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}