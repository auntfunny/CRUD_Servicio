import { useState } from "react";
import useAxios from "../hooks/useAxios";
import ModalAgregarEditar from "../components/ModalAgregarEditar";
import ModalConfirmacion from "../components/ModalConfirmacion";
import { useToast } from "../context/ToastContext"; // ← NUEVO

function Cursos() {
  const { setToastMensaje } = useToast(); // ← NUEVO

  const [modalAgregar, setModalAgregar] = useState(false);
  const [modalEditar, setModalEditar] = useState(false);
  const [confirmarBorrar, setConfirmarBorrar] = useState(false);
  const [editarId, setEditarId] = useState(null);
  const [editarCampos, setEditarCampos] = useState(null);
  const [idBorrar, setIdBorrar] = useState(null);

  const { data: courses, loading, error, request } = useAxios("/courses/");
  const { request: requestBorrar, loading: loadingBorrar } = useAxios("", { method: "DELETE" });

  const handleCerrarAgregar = (actualizar) => {
    setModalAgregar(false);
    if (actualizar) {
      setToastMensaje("Curso creado exitosamente"); // ← NUEVO
      request();
    }
  };

  const handleAbrirEditar = (curso) => {
    setEditarId(curso.id);
    setEditarCampos({ name: curso.name, duration: curso.duration, required_service_hours: curso.required_service_hours, price: curso.price });
    setModalEditar(true);
  };

  const handleCerrarEditar = (actualizar) => {
    setModalEditar(false);
    setEditarCampos(null);
    setEditarId(null);
    if (actualizar) {
      setToastMensaje("Curso actualizado exitosamente"); // ← NUEVO
      request();
    }
  };

  const handleAbrirBorrar = (id) => {
    setIdBorrar(id);
    setConfirmarBorrar(true);
  };

  const cancelarBorrar = () => {
    setIdBorrar(null);
    setConfirmarBorrar(false);
  };

  const confirmarAccionBorrar = async () => {
    try {
      setConfirmarBorrar(false);
      await requestBorrar({ url: `/courses/${idBorrar}` });
      setToastMensaje("Curso eliminado exitosamente"); // ← NUEVO
      request();
    } catch (err) {
      console.error("Error al borrar el curso");
    } finally {
      setIdBorrar(null);
    }
  };

  return (
    <div className="flex flex-col items-center gap-10 py-18 w-full min-h-screen">

      {modalAgregar && (
        <ModalAgregarEditar
          url={"/courses/"}
          campos={{ name: "", duration: "", required_service_hours: "", price: "" }}
          cerrar={handleCerrarAgregar}
        />
      )}

      {modalEditar && (
        <ModalAgregarEditar
          url={`/courses/${editarId}`}
          campos={editarCampos}
          cerrar={handleCerrarEditar}
        />
      )}

      {confirmarBorrar && (
        <ModalConfirmacion
          titulo={"Confirma Borrar"}
          mensaje={"¿Estás segur@ que quieres eliminar este curso?"}
          onConfirm={confirmarAccionBorrar}
          onCancel={cancelarBorrar}
        />
      )}

      {/* HEADER */}
      <div className="flex justify-between items-center w-11/12 md:w-4/5 h-20 bg-gray-200 rounded-xl p-6">
        <h2 className="text-lg text-acc2 font-avenir font-medium">Gestión de Cursos</h2>
        <button onClick={() => setModalAgregar(true)} type="button" className="flex items-center justify-center w-8 h-8 rounded-full bg-acc1 text-white hover:bg-acc2 hover:cursor-pointer">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>

      {/* TARJETAS */}
      <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 place-items-center gap-2 lg:gap-4">
        {error && <p className="col-span-4 text-red-500 text-2xl text-center">Error al cargar los cursos</p>}

        {loading
          ? Array(4).fill().map((_, index) => (
              <div key={index} className="w-40 h-40 md:w-50 md:h-50 rounded-lg bg-gray-400 animate-pulse" />
            ))
          : courses?.map((item) => (
              <div key={item.id} className="relative flex flex-col justify-between w-40 h-40 md:w-50 md:h-50 p-2 rounded-lg bg-gray-100 border border-acc1 shadow-lg">
                <p className="text-xs text-gray-500">id: {item.id}</p>

                <div className="px-3 flex flex-col justify-center h-full gap-1">
                  <p className="text-acc1 text-sm md:text-base font-avenir text-center font-bold">{item.name}</p>
                  <p className="text-acc2 text-xs font-montserrat">⏱ {item.duration} meses</p>
                  <p className="text-acc2 text-xs font-montserrat">🕐 {item.required_service_hours} hrs</p>
                  <p className="text-acc2 text-xs font-montserrat">💲 {item.price}</p>
                </div>

                <p className="text-xs text-gray-500 italic">Creado: {item.created_at?.split("T")[0]}</p>

                <div className="absolute top-1 right-1 flex gap-2">
                  <button onClick={() => handleAbrirEditar(item)} type="button" className="text-gray-500 hover:text-acc2 hover:cursor-pointer active:scale-125 transition-transform">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125" />
                    </svg>
                  </button>

                  {loadingBorrar && idBorrar === item.id ? (
                    <div className="w-5 h-5 border-2 border-gray-500 border-t-acc3 rounded-full animate-spin" />
                  ) : (
                    <button onClick={() => handleAbrirBorrar(item.id)} type="button" className="text-gray-500 hover:text-red-600 hover:cursor-pointer active:scale-125 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))
        }
      </section>
    </div>
  );
}

export default Cursos;