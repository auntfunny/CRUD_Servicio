import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ModalConfirmacion from "../components/ModalConfirmacion";

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize] = useState(5);
  const [loading, setLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, [page]);

  async function loadUsers() {
    setLoading(true);

    try {
      await new Promise((res) => setTimeout(res, 500));

      const fakeUsers = Array.from({ length: 23 }, (_, i) => ({
        id: i + 1,
        full_name: `Usuario ${i + 1}`,
        email: `user${i + 1}@mail.com`,
        role: i % 2 === 0 ? "ADMIN" : "STUDENT",
        is_active: i % 3 !== 0,
        created_at: "2026-04-14",
      }));

      setTotal(fakeUsers.length);

      const start = (page - 1) * pageSize;
      const end = start + pageSize;

      setUsuarios(fakeUsers.slice(start, end));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

 async function handleDelete() {
  if (!userToDelete) return;

  try {
    //LLAMADA REAL A LA API
    await api.delete(`/users/${userToDelete.id}`);

    alert("Usuario eliminado correctamente (API)");

    // refrescar lista desde backend
    loadUsers();

  } catch (error) {
    console.log("ERROR DELETE:", error.response?.data);

    //FALLBACK SIMULADO
    if (error.response?.status === 401) {
      console.warn("API FALLÓ → usando simulación");

      await new Promise((res) => setTimeout(res, 500));

      setUsuarios((prev) =>
        prev.map((u) =>
          u.id === userToDelete.id ? { ...u, is_active: false } : u
        )
      );

      alert("Usuario desactivado (SIMULADO)");
    } else {
      alert("Error al eliminar usuario");
    }
  } finally {
    setUserToDelete(null);
  }
}

  const totalPages = Math.ceil(total / pageSize);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0b1f3a] text-white">
        Cargando usuarios...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#2c5b98_0%,_#183b68_45%,_#0b1f3a_100%)] px-4 py-8">

      <div className="mx-auto max-w-7xl">

        <section className="grid overflow-hidden rounded-[32px] bg-white shadow-[0_35px_100px_rgba(7,19,39,0.32)] lg:grid-cols-[0.8fr_1.4fr]">

          {/* 🔵 LADO IZQUIERDO */}
          <aside className="relative flex flex-col justify-between bg-[#143963] px-8 py-10 text-white">

            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(106,144,216,0.9)_0%,rgba(129,117,216,0.82)_40%,rgba(236,157,211,0.92)_78%,rgba(16,44,80,0.98)_100%)]" />

            <div className="relative z-10">
              <h1 className="text-2xl font-bold tracking-[0.2em]">FUNVAL</h1>

              <h2 className="mt-6 text-3xl font-semibold">
                Usuarios
              </h2>

              <p className="mt-4 text-sm text-white/80">
                Administra los usuarios del sistema, edita o elimina registros.
              </p>
            </div>

            <div className="relative z-10 text-sm text-white/70">
              Total: {total} usuarios
            </div>
          </aside>

          {/* 🧾 CONTENIDO */}
          <div className="px-8 py-10">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-slate-800">
                Lista de usuarios
              </h2>

              <button
                onClick={() => navigate("/usuarios/crear")}
                className="rounded-full bg-[linear-gradient(90deg,#7796db_0%,#5d80c8_45%,#3b5f9f_100%)] px-6 py-3 text-white font-semibold shadow-lg hover:scale-[1.03] transition"
              >
                + Crear usuario
              </button>
            </div>

            {/* TABLA */}
            <div className="overflow-hidden rounded-2xl border border-slate-100">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-500">
                  <tr>
                    <th className="p-4 text-left">Nombre</th>
                    <th className="p-4 text-left">Email</th>
                    <th className="p-4 text-left">Rol</th>
                    <th className="p-4 text-left">Estado</th>
                    <th className="p-4 text-left">Registro</th>
                    <th className="p-4 text-right">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {usuarios.map((user) => (
                    <tr key={user.id} className="border-t hover:bg-slate-50 transition">

                      <td className="p-4 font-medium text-slate-700">
                        {user.full_name}
                      </td>

                      <td className="p-4 text-slate-600">
                        {user.email}
                      </td>

                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === "ADMIN"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-purple-100 text-purple-700"
                        }`}>
                          {user.role}
                        </span>
                      </td>

                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}>
                          {user.is_active ? "Activo" : "Inactivo"}
                        </span>
                      </td>

                      <td className="p-4 text-slate-500">
                        {user.created_at}
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() => navigate(`/usuarios/${user.id}/editar`)}
                            className="px-3 py-1 text-xs rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                          >
                            Editar
                          </button>

                          <button
                            onClick={() => setUserToDelete(user)}
                            className="px-3 py-1 text-xs rounded bg-red-100 text-red-700 hover:bg-red-200"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* PAGINACIÓN */}
            <div className="flex justify-between items-center mt-6">
              <span className="text-sm text-slate-500">
                Página {page} de {totalPages}
              </span>

              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  ←
                </button>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1 border rounded disabled:opacity-50"
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* MODAL */}
      {userToDelete && (
        <ModalConfirmacion
          titulo="Confirmar eliminación"
          mensaje={`¿Seguro que deseas eliminar a ${userToDelete.full_name}?`}
          onConfirm={handleDelete}
          onCancel={() => setUserToDelete(null)}
        />
      )}
    </main>
  );
}