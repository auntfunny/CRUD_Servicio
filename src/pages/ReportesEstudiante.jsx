import { useEffect, useMemo, useState } from "react";
import Paginacion from "../components/Paginacion";
import ReporteCard from "../components/ReporteCard";
import ReporteDetalleModal from "../components/ReporteDetalleModal";
import ReporteFormModal from "../components/ReporteFormModal";
import { useAuth } from "../context/AuthContext";
import useUpload from "../hooks/useUpload";
import useAxios from "../hooks/useAxios";
import { estadoOptions, getFechaOrdenable } from "../utils/reportes";

function ReportesEstudiante() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [modalCrearAbierto, setModalCrearAbierto] = useState(false);
  const [reporteEditando, setReporteEditando] = useState(null);
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [ordenActual, setOrdenActual] = useState("fecha-desc");
  const [pageConsulta, setPageConsulta] = useState(1);

  const paramsConsulta = useMemo(() => {
    const params = {
      page: pageConsulta,
      page_size: pageSize,
    };

    if (estadoFiltro) {
      params.status = estadoFiltro;
    }

    return params;
  }, [estadoFiltro, pageConsulta, pageSize]);

  const {
    data,
    error,
    loading,
    request: recargarReportes,
  } = useAxios("/reports/", {
    params: paramsConsulta,
  });

  const { data: categoriasData } = useAxios("/categories/", {
    auto: modalCrearAbierto || Boolean(reporteEditando),
  });

  const {
    actualizarReporte,
    actualizandoReporte,
    guardandoReporte,
    guardarReporte,
  } = useUpload();

  const reportes = Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.results)
        ? data.results
        : Array.isArray(data)
          ? data
          : [];
  const categorias = Array.isArray(categoriasData?.items)
    ? categoriasData.items
    : Array.isArray(categoriasData?.data)
      ? categoriasData.data
      : Array.isArray(categoriasData?.results)
        ? categoriasData.results
        : Array.isArray(categoriasData)
          ? categoriasData
          : [];
  const mensajeError =
    error?.response?.data?.detail?.[0]?.msg ??
    "No se pudieron cargar los reportes.";

  const total = data?.total ?? reportes.length;
  const reportesVisibles = useMemo(() => {
    const lista = [...reportes];

    const listaOrdenada = lista.sort((reporteA, reporteB) => {
      if (ordenActual === "horas-desc" || ordenActual === "horas-asc") {
        return Number(reporteA.hours_spent ?? 0) - Number(reporteB.hours_spent ?? 0);
      }

      return getFechaOrdenable(reporteA.created_at) - getFechaOrdenable(reporteB.created_at);
    });

    if (ordenActual === "fecha-desc" || ordenActual === "horas-desc") {
      return [...listaOrdenada].reverse();
    }

    return listaOrdenada;
  }, [ordenActual, reportes]);

  useEffect(() => {
    setPage(1);
  }, [estadoFiltro, ordenActual]);

  useEffect(() => {
    if (ordenActual !== "fecha-asc") {
      setPageConsulta(page);
      return;
    }

    const totalPaginas = Math.max(1, Math.ceil(total / pageSize));
    setPageConsulta(Math.max(1, totalPaginas - page + 1));
  }, [ordenActual, page, pageSize, total]);

  const abrirDetalle = (reporte) => {
    setReporteSeleccionado(reporte);
  };

  const cerrarDetalle = () => {
    setReporteSeleccionado(null);
  };

  const abrirEditar = () => {
    if (!reporteSeleccionado || reporteSeleccionado.status !== "PENDING") {
      return;
    }

    setReporteEditando(reporteSeleccionado);
    cerrarDetalle();
  };

  const cerrarEditar = () => {
    setReporteEditando(null);
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
      params: paramsConsulta,
    });
  };

  const guardarEdicionReporte = async (formData) => {
    if (!reporteEditando) return;

    await actualizarReporte(reporteEditando.id, formData);
    cerrarEditar();
    await recargarReportes({
      params: paramsConsulta,
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

          <button
            className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
            onClick={abrirCrear}
            type="button"
          >
            Agregar nuevo
          </button>
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

      {reporteEditando ? (
        <ReporteFormModal
          categorias={categorias}
          initialData={reporteEditando}
          loading={actualizandoReporte}
          onClose={cerrarEditar}
          onSubmit={guardarEdicionReporte}
          title="Editar reporte pendiente"
        />
      ) : null}

      {reporteSeleccionado ? (
        <ReporteDetalleModal
          canEdit={reporteSeleccionado.status === "PENDING"}
          onClose={cerrarDetalle}
          onEdit={abrirEditar}
          reporte={reporteSeleccionado}
        />
      ) : null}
    </main>
  );
}

export default ReportesEstudiante;
