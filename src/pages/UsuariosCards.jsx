import { useEffect, useState } from "react";
import { instance as api } from "../api";
import { useNavigate } from "react-router-dom";

export default function UsuariosCards() {
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

  // 🔥 FUNCIÓN ELIMINAR
  async function eliminarUsuario(id) {
    const confirmar = window.confirm(
      "¿Seguro que quieres eliminar este usuario?"
    );
    if (!confirmar) return;

    try {
      await api.delete(`/users/${id}`);

      // actualizar UI sin recargar
      setUsuarios((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Error eliminando usuario:", err.response?.data);
      alert("No se pudo eliminar el usuario ❌");
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#2c5b98_0%,_#183b68_45%,_#0b1f3a_100%)] px-4 py-10">

      <div className="max-w-6xl mx-auto bg-white rounded-[32px] p-8 shadow-[0_35px_100px_rgba(7,19,39,0.32)]">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-slate-800">
            Usuarios (Tarjetas)
          </h2>

          <button
            onClick={() => navigate("/usuarios/crear")}
            className="rounded-full bg-[linear-gradient(90deg,#7796db,#3b5f9f)] px-6 py-2 text-white font-semibold"
          >
            + Crear Usuario
          </button>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-center text-slate-600">
            Cargando usuarios...
          </p>
        )}

        {/* ERROR */}
        {error && (
          <p className="text-center text-red-500">{error}</p>
        )}

        {/* GRID */}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {usuarios.length === 0 ? (
              <p className="text-gray-500 col-span-full text-center">
                No hay usuarios
              </p>
            ) : (
              usuarios.map((u) => (
                <div
                  key={u.id}
                  className="bg-white border rounded-2xl shadow-md p-5 hover:shadow-xl transition"
                >
                  <h3 className="text-lg font-semibold text-slate-800">
                    {u.first_name} {u.last_name}
                  </h3>

                  <p className="text-sm text-slate-600 mt-1">
                    📧 {u.email}
                  </p>

                  <p className="text-sm text-slate-600 mt-1">
                    🪪 {u.document_number}
                  </p>

                  <span className="inline-block mt-3 px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                    {u.role}
                  </span>

                  {/* BOTONES */}
                  <div className="flex gap-3 mt-4">

                    <button
                      onClick={() =>
                        navigate(`/usuarios/${u.id}/editar`)
                      }
                      className="text-blue-600 hover:underline text-sm"
                    >
                      Editar
                    </button>

                    <button
                      onClick={() => eliminarUsuario(u.id)}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Eliminar
                    </button>

                  </div>
                </div>
              ))
            )}

          </div>
        )}
      </div>
    </main>
  );
}