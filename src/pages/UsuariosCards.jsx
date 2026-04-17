import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import ModalConfirmacion from "../components/ModalConfirmacion";
import Paginacion from "../components/Paginacion";
import { useToast } from "../context/ToastContext";

export default function UsuariosCards() {
  const {setToastMensaje} = useToast();
  const [confirmarBorrar, setConfirmarBorrar] = useState(false);
  const [borrandoID, setBorrandoID] = useState(null);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const navigate = useNavigate();

  const { data, loading, error, request } = useAxios("/users/", {
    params: { page, page_size: pageSize },
  });
  const {
    loading: loadingBorrar,
    error: errorBorrar,
    request: requestBorrar,
  } = useAxios("", { method: "DELETE" });


  const usuarios = data?.items ?? [];
  const total = data?.total ?? 0;

  function pedirConfirmar(id) {
    setBorrandoID(id);
    setConfirmarBorrar(true);
  }

  async function borrarUsuario() {
    try {
      setConfirmarBorrar(false);
      await requestBorrar({ url: `/users/${borrandoID}` });
      setToastMensaje("Usuario eliminado exitosamente");
      request();
    } catch (err) {
      console.error(err);
    } finally {
      setBorrandoID(null);
    }
  }

  function cancelarBorrar() {
    setBorrandoID(null);
    setConfirmarBorrar(false);
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_#2c5b98_0%,_#183b68_45%,_#0b1f3a_100%)] px-4 py-10">
      {confirmarBorrar && (
        <ModalConfirmacion
          titulo={"Confirma Borrar"}
          mensaje={"Estás segur@ que quieres borrar este usuario?"}
          onConfirm={borrarUsuario}
          onCancel={cancelarBorrar}
        />
      )}
      <div className="max-w-6xl mx-auto bg-white rounded-[32px] p-8 shadow-[0_35px_100px_rgba(7,19,39,0.32)]">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold text-slate-800">Usuarios</h2>
          <div className="flex gap-2">
            <button
              onClick={() => navigate("/usuarios/import")}
              className="rounded-full bg-[linear-gradient(90deg,#7796db,#3b5f9f)] px-6 py-2 text-white font-semibold"
            >
              Importar CSV
            </button>
            <button
              onClick={() => navigate("/usuarios/crear")}
              className="rounded-full bg-[linear-gradient(90deg,#7796db,#3b5f9f)] px-6 py-2 text-white font-semibold"
            >
              + Crear Usuario
            </button>
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <p className="text-center text-slate-600">Cargando usuarios...</p>
        )}

        {/* ERROR */}
        {error && <p className="text-center text-red-500">No se pudieron cargar los usuarios</p>}

        {/* GRID */}
        {!loading && !error && (
          <>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
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

                    <p className="text-sm text-slate-600 mt-1">📧 {u.email}</p>

                    <p className="text-sm text-slate-600 mt-1">
                      🪪 {u.document_number}
                    </p>

                    <span className="inline-block mt-3 px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700">
                      {u.role}
                    </span>

                    {/* BOTONES */}
                    <div className="flex gap-3 mt-4">
                      {loadingBorrar && borrandoID === u.id ? (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-500 border-t-red-500 animate-spin"></div>
                      ) : (
                        <button
                          onClick={() => pedirConfirmar(u.id)}
                          className="text-red-500 hover:underline text-sm"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="mt-6">
              <Paginacion
                onPageChange={setPage}
                page={page}
                page_size={pageSize}
                total={total}
              />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
