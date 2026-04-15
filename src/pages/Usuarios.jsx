import { useEffect, useState } from "react";
import { instance as api } from "../api";
import { useNavigate } from "react-router-dom";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    cargarUsuarios();
  }, []);

 async function cargarUsuarios() {
  setLoading(true);
  setError(null);

  try {
    const res = await api.get("/users/");
    const data = res.data;

    console.log("USUARIOS API:", data);

    setUsuarios(
      Array.isArray(data)
        ? data
        : data.items || data.results || []
    );

  } catch (err) {
    console.error("Error cargando usuarios:", err.response?.data);
    setError("No se pudieron cargar los usuarios ❌");
  } finally {
    setLoading(false);
  }
}

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#2c5b98_0%,_#183b68_45%,_#0b1f3a_100%)] px-4 py-8">

      <div className="max-w-6xl mx-auto bg-white rounded-[32px] p-8 shadow-[0_35px_100px_rgba(7,19,39,0.32)]">

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-slate-800">
            Usuarios
          </h2>

          <button
            onClick={() => navigate("/usuarios/crear")}
            className="rounded-full bg-[linear-gradient(90deg,#7796db,#3b5f9f)] px-6 py-2 text-white font-semibold"
          >
            + Crear Usuario
          </button>
        </div>

        {/* 🔄 LOADING */}
        {loading && (
          <p className="text-center text-slate-600">Cargando usuarios...</p>
        )}

        {/* ❌ ERROR */}
        {error && (
          <p className="text-center text-red-500">{error}</p>
        )}

        {/* ✅ LISTADO */}
        {!loading && !error && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">

              <thead>
                <tr className="border-b">
                  <th className="py-2">Nombre</th>
                  <th>Email</th>
                  <th>Documento</th>
                  <th>Rol</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {usuarios.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-6 text-gray-500">
                      No hay usuarios
                    </td>
                  </tr>
                ) : (
                  usuarios.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">

                      <td className="py-3">
                        {u.first_name} {u.last_name}
                      </td>

                      <td>{u.email}</td>

                      <td>{u.document_number}</td>

                      <td>{u.role}</td>

                      <td>
                        <button
                          onClick={() => navigate(`/usuarios/${u.id}/editar`)}
                          className="text-blue-600 hover:underline"
                        >
                          Editar
                        </button>
                      </td>

                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
        )}

      </div>
    </main>
  );
}