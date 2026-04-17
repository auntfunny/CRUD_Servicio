import { useEffect, useMemo, useState } from "react";
import BadgeEstadoReporte from "../components/BadgeEstadoReporte";
import Paginacion from "../components/Paginacion";
import ReporteDetalleModal from "../components/ReporteDetalleModal";
import ReporteFormModal from "../components/ReporteFormModal";
import TarjetaEstadistica from "../components/TarjetaEstadistica";
import {
  PageShell,
  controlClass,
  panelBaseClass,
  primaryButtonClass,
} from "../components/PageShell";
import { useAuth } from "../context/AuthContext";
import useUpload from "../hooks/useUpload";
import useAxios from "../hooks/useAxios";
import { estadoOptions, getFechaOrdenable, formatFecha, formatHoras } from "../utils/reportes";
import { useToast } from "../context/ToastContext";

function ReportesEstudiante() {
  const {setToastMensaje} = useToast();
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
  const { data: dashboardData } = useAxios("/dashboard/stats");

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

  const resumen = useMemo(() => ({
    aprobados: dashboardData?.reports?.approved ?? 0,
    pendientes: dashboardData?.reports?.pending ?? 0,
    rechazados: dashboardData?.reports?.rejected ?? 0,
    totalHoras: dashboardData?.reports?.total_hours_submitted ?? 0,
  }), [dashboardData]);

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
    setToastMensaje("Reporte creado exitosamente");
    cerrarCrear();
    await recargarReportes({
      params: paramsConsulta,
    });
  };

  const guardarEdicionReporte = async (formData) => {
    if (!reporteEditando) return;

    await actualizarReporte(reporteEditando.id, formData);
    setToastMensaje("Reporte actualizado exitosamente");
    cerrarEditar();
    await recargarReportes({
      params: paramsConsulta,
    });
  };

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--color-acc1)]">
              Mis reportes
            </p>
            <h1 className="mt-2 text-4xl font-semibold text-slate-900">
              Reportes de {user?.full_name ?? "servicio"}
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Consulta tu historial y abre el detalle de cada envio desde una vista mas ordenada.
            </p>
          </div>

          <button
            className={primaryButtonClass}
            onClick={abrirCrear}
            type="button"
          >
            Agregar nuevo
          </button>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <TarjetaEstadistica label="Total" tone="text-slate-800" value={total} />
          <TarjetaEstadistica label="Pendientes" tone="text-amber-700" value={resumen.pendientes} />
          <TarjetaEstadistica label="Aprobados" tone="text-emerald-700" value={resumen.aprobados} />
          <TarjetaEstadistica label="Horas" tone="text-[#1958df]" value={resumen.totalHoras} />
        </section>

        <section className={`${panelBaseClass} !bg-white`}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Filtrar por estado
              <select
                className={controlClass}
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
                className={controlClass}
                onChange={(evento) => setOrdenActual(evento.target.value)}
                value={ordenActual}
              >
                <option value="fecha-desc">Mas recientes</option>
                <option value="fecha-asc">Mas antiguos</option>
                <option value="horas-desc">Mas horas</option>
                <option value="horas-asc">Menos horas</option>
              </select>
            </label>
          </div>
        </section>

        {loading ? <p className="text-sm text-slate-500">Cargando reportes...</p> : null}
        {!loading && error ? <p className="text-red-600">{mensajeError}</p> : null}

        {!loading && !error ? (
          <>
            <section className={`${panelBaseClass} overflow-x-auto !bg-white !p-0`}>
              <div className="min-w-[860px]">
                <div className="grid grid-cols-[1.7fr_0.9fr_0.8fr_0.85fr_0.95fr_0.8fr] gap-4 border-b border-slate-100 bg-slate-50/90 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  <span>Actividad</span>
                  <span>Categoria</span>
                  <span>Horas</span>
                  <span>Fecha</span>
                  <span>Estado</span>
                  <span>Accion</span>
                </div>

                {reportesVisibles.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {reportesVisibles.map((reporte) => (
                      <div
                        key={reporte.id}
                        className="grid cursor-pointer grid-cols-[1.7fr_0.9fr_0.8fr_0.85fr_0.95fr_0.8fr] items-center gap-4 px-6 py-4 text-sm text-slate-600 transition hover:bg-slate-50/60"
                        onClick={() => abrirDetalle(reporte)}
                        onKeyDown={(evento) => {
                          if (evento.key === "Enter" || evento.key === " ") {
                            evento.preventDefault();
                            abrirDetalle(reporte);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                      >
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-800">
                            {reporte.description || "Actividad sin descripcion"}
                          </p>
                          <p className="mt-1 text-xs text-slate-400">
                            Reporte #{reporte.id}
                          </p>
                        </div>
                        <p className="truncate font-medium text-slate-700">
                          {reporte.category?.name ?? "Sin categoria"}
                        </p>
                        <p className="font-semibold text-slate-800">
                          {formatHoras(reporte.hours_spent)}
                        </p>
                        <p>{formatFecha(reporte.created_at)}</p>
                        <BadgeEstadoReporte estado={reporte.status} />
                        <div className="flex flex-wrap gap-2">
                          <button
                            className="inline-flex items-center justify-center rounded-full bg-[#eef5ff] px-4 py-2 text-xs font-semibold text-[#1958df] transition hover:bg-[#e0ecff]"
                            onClick={(evento) => {
                              evento.stopPropagation();
                              abrirDetalle(reporte);
                            }}
                            type="button"
                          >
                            Ver
                          </button>
                          {reporte.status === "PENDING" ? (
                            <button
                              className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
                              onClick={(evento) => {
                                evento.stopPropagation();
                                setReporteEditando(reporte);
                              }}
                              type="button"
                            >
                              Editar
                            </button>
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-10 text-sm text-slate-500">
                    No se encontraron reportes para este filtro.
                  </div>
                )}
              </div>
            </section>

            <Paginacion
              onPageChange={setPage}
              page={page}
              page_size={pageSize}
              total={total}
            />
          </>
        ) : null}

        {modalCrearAbierto ? (
          <ReporteFormModal
            categorias={categorias}
            loading={guardandoReporte}
            onClose={cerrarCrear}
            onSubmit={guardarNuevoReporte}
            title="Nuevo reporte"
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
      </div>
    </PageShell>
  );
}

export default ReportesEstudiante;
