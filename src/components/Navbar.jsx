import { useAuth } from "../context/AuthContext";
import useAxios from "../hooks/useAxios";

export default function Navbar({ abierto, setAbierto }) {
  const { user, logout } = useAuth();
  const { data: curso, loading } = useAxios("/courses/32");

  console.log(user);
  if (!user) return null;

  return (
    <div className="flex justify-around bg-[#2c5b98] text-white font-medium h-12 items-center">
      <img className="w-10 h-10 " src="/icons/iconoFunval.svg" alt="icono funval" />
      <div className="flex flex-col items-center leading-none">
        {/* Nombre y Apellido */}
        <span className="text-red-500">
          {user.first_name} {user.last_name}
        </span>

        {/* Condicional para el curso: Solo si es STUDENT y ya cargó */}
        {!loading && user.role === "STUDENT" && curso && (
          <span className="text-[10px] text-blue-100 font-light">
            {curso.name}
          </span>
        )}
      </div>
      <button className="" onClick={logout}>
        Logout
      </button>
      <button
        onClick={() => setAbierto(!abierto)} className="p-2 md:hidden" >
        <div className="space-y-1">
          <div className="w-6 h-0.5 bg-white"></div>
          <div className="w-6 h-0.5 bg-white"></div>
          <div className="w-6 h-0.5 bg-white"></div>
        </div>
      </button>
    </div>
  );
}

//https://hs-api.devfunval.cloud/api/v1/courses/32