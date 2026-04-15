import { useMemo, useState } from "react";
import Paginacion from "../components/Paginacion";
import ReporteCard from "../components/ReporteCard";
import ReporteDetalleModal from "../components/ReporteDetalleModal";
import ReporteFormModal from "../components/ReporteFormModal";
import { useAuth } from "../context/AuthContext";
import useUpload from "../hooks/useUpload";
import useAxios from "../hooks/useAxios";
import { estadoOptions } from "../utils/reportes";

function ReportesEstudiante() {
  const { logout, user } = useAuth();
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [ordenActual, setOrdenActual] = useState("fecha-desc");

  const {
    data,
    error,
    loading,
    request: recargarReportes,
  } = useAxios("/reports/", {
    params: { page, page_size: pageSize },
  });

  const { data: categoriasData } = useAxios("/categories/", {
    auto: modalCrearAbierto,
  });

  const {
    guardandoReporte,
    guardarReporte,
  } = useUpload();

  const reportes = data?.items ?? data?.data ?? [];
  const total = data?.total ?? 0;
  const categorias = categoriasData?.items ?? categoriasData?.data ?? categoriasData ?? [];
  const mensajeError =
    error?.response?.data?.detail?.[0]?.msg ??
    "No se pudieron cargar los reportes.";

  const reportesVisibles = useMemo(() => {
    const listaBase = [...reportes];

    const listaFiltrada = estadoFiltro
      ? listaBase.filter((reporte) => reporte.status === estadoFiltro)
      : listaBase;

    return listaFiltrada.sort((reporteA, reporteB) => {
      if (ordenActual === "fecha-asc") {
        return new Date(reporteA.created_at) - new Date(reporteB.created_at);
      }

      if (ordenActual === "horas-desc") {
        return Number(reporteB.hours_spent ?? 0) - Number(reporteA.hours_spent ?? 0);
      }

      if (ordenActual === "horas-asc") {
        return Number(reporteA.hours_spent ?? 0) - Number(reporteB.hours_spent ?? 0);
      }

      return new Date(reporteB.created_at) - new Date(reporteA.created_at);
    });
  }, [estadoFiltro, ordenActual, reportes]);

  const abrirDetalle = (reporte) => {
    setReporteSeleccionado(reporte);
  };

  const cerrarDetalle = () => {
    setReporteSeleccionado(null);
  };

  const abrirCrear = () => {
    setModalCrearAbierto(true);
  };

  const cerrarCrear = () => {
    setModalCrearAbierto(false);
  };

  const guardarNuevoReporte = async (formData) => {
    await guardarReporte(formData);
    cerrarCrear();
    await recargarReportes({
      params: { page, page_size: pageSize },
    });
  };

  return (
    <main className="mx-auto max-w-7xl p-6">
      <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">
              Estudiante
            </p>
            <h1 className="text-2xl font-semibold text-slate-900">
              Reportes de {user?.full_name ?? "servicio"}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Revisa tus reportes y crea uno nuevo cuando lo necesites.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
              onClick={logout}
              type="button"
            >
              Logout
            </button>

            <button
              className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
              onClick={abrirCrear}
              type="button"
            >
              Agregar nuevo
            </button>
          </div>
        </div>
      </section>

      <section className="mb-6 grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Filtrar por estado
          <select
            className="rounded-2xl border border-slate-300 px-4 py-3"
            onChange={(evento) => setEstadoFiltro(evento.target.value)}
            value={estadoFiltro}
          >
            {estadoOptions.map((estado) => (
              <option key={estado.value} value={estado.value}>
                {estado.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Ordenar por
          <select
            className="rounded-2xl border border-slate-300 px-4 py-3"
            onChange={(evento) => setOrdenActual(evento.target.value)}
            value={ordenActual}
          >
            <option value="fecha-desc">Mas recientes</option>
            <option value="fecha-asc">Mas antiguos</option>
            <option value="horas-desc">Mas horas</option>
            <option value="horas-asc">Menos horas</option>
          </select>
        </label>
      </section>

      {loading ? <p>Cargando reportes...</p> : null}
      {!loading && error ? <p className="text-red-600">{mensajeError}</p> : null}

      {!loading && !error ? (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {reportesVisibles.map((reporte) => (
              <ReporteCard
                key={reporte.id}
                onClick={() => abrirDetalle(reporte)}
                reporte={reporte}
              />
            ))}
          </section>

          <div className="mt-6">
            <Paginacion
              onPageChange={setPage}
              page={page}
              page_size={pageSize}
              total={total}
            />
          </div>
        </>
      ) : null}

      {modalCrearAbierto ? (
        <ReporteFormModal
          categorias={categorias}
          loading={guardandoReporte}
          onClose={cerrarCrear}
          onSubmit={guardarNuevoReporte}
          title="Crear reporte"
        />
      ) : null}

      {reporteSeleccionado ? (
        <ReporteDetalleModal
          deleteEnabled={false}
          onClose={cerrarDetalle}
          onDelete={() => {}}
          reporte={reporteSeleccionado}
        />
      ) : null}
    </main>
  );
}

export default ReportesEstudiante;
