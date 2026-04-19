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
import { FiltersSkeleton, StatsGridSkeleton, TableSkeleton } from "../components/SkeletonBlocks";
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
  const [reportesResumen, setReportesResumen] = useState([]);
  const [cargandoResumen, setCargandoResumen] = useState(false);

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
  const { request: consultarResumenReportes } = useAxios("/reports/", {
    auto: false,
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
  const usarColeccionCompleta = Boolean(estadoFiltro);
  const reportesOrdenados = useMemo(() => {
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

  const reportesVisibles = useMemo(() => {
    if (!usarColeccionCompleta) return reportesOrdenados;

    const listaOrdenada = [...reportesResumen].sort((reporteA, reporteB) => {
      if (ordenActual === "horas-desc" || ordenActual === "horas-asc") {
        return Number(reporteA.hours_spent ?? 0) - Number(reporteB.hours_spent ?? 0);
      }

      return getFechaOrdenable(reporteA.created_at) - getFechaOrdenable(reporteB.created_at);
    });

    if (ordenActual === "fecha-desc" || ordenActual === "horas-desc") {
      listaOrdenada.reverse();
    }

    const inicio = (page - 1) * pageSize;
    return listaOrdenada.slice(inicio, inicio + pageSize);
  }, [ordenActual, page, pageSize, reportesOrdenados, reportesResumen, usarColeccionCompleta]);

  const totalVisible = usarColeccionCompleta ? reportesResumen.length : total;
  const resumen = useMemo(() => {
    if (usarColeccionCompleta) {
      return reportesResumen.reduce(
        (acc, reporte) => {
          acc.total += 1;
          acc.totalHoras += Number(reporte.hours_spent ?? 0);
          if (reporte.status === "APPROVED") acc.aprobados += 1;
          if (reporte.status === "PENDING") acc.pendientes += 1;
          if (reporte.status === "REJECTED") acc.rechazados += 1;
          return acc;
        },
        { aprobados: 0, pendientes: 0, rechazados: 0, total: 0, totalHoras: 0 },
      );
    }

    return {
      aprobados: dashboardData?.reports?.approved ?? 0,
      pendientes: dashboardData?.reports?.pending ?? 0,
      rechazados: dashboardData?.reports?.rejected ?? 0,
      total: total,
      totalHoras: dashboardData?.reports?.total_hours_submitted ?? 0,
    };
  }, [dashboardData, reportesResumen, total, usarColeccionCompleta]);

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

  useEffect(() => {
    if (!usarColeccionCompleta) {
      setReportesResumen([]);
      setCargandoResumen(false);
      return;
    }

    let cancelado = false;

    const cargarResumen = async () => {
      setCargandoResumen(true);

      try {
        let paginaActual = 1;
        let totalPaginas = 1;
        const acumulados = [];

        while (paginaActual <= totalPaginas) {
          const respuesta = await consultarResumenReportes({
            params: {
              page: paginaActual,
              page_size: pageSize,
              ...(estadoFiltro ? { status: estadoFiltro } : {}),
            },
            preferCache: false,
          });

          const itemsPagina = Array.isArray(respuesta?.items)
            ? respuesta.items
            : Array.isArray(respuesta?.data)
              ? respuesta.data
              : Array.isArray(respuesta?.results)
                ? respuesta.results
                : Array.isArray(respuesta)
                  ? respuesta
                  : [];

          acumulados.push(...itemsPagina);
          const totalItems = Number(respuesta?.total ?? acumulados.length);
          totalPaginas = Math.max(1, Math.ceil(totalItems / pageSize));
          paginaActual += 1;
        }

        if (!cancelado) {
          setReportesResumen(acumulados);
        }
      } finally {
        if (!cancelado) {
          setCargandoResumen(false);
        }
      }
    };

    cargarResumen();

    return () => {
      cancelado = true;
    };
  }, [consultarResumenReportes, estadoFiltro, pageSize, usarColeccionCompleta]);

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
        <section className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
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

        {!(loading && !data) ? (
          <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
            <TarjetaEstadistica label="Total" tone="text-slate-800" value={totalVisible} />
            <TarjetaEstadistica label="Pendientes" tone="text-amber-700" value={resumen.pendientes} />
            <TarjetaEstadistica label="Aprobados" tone="text-emerald-700" value={resumen.aprobados} />
            <TarjetaEstadistica label="Horas" tone="text-[#1958df]" value={resumen.totalHoras} />
          </section>
        ) : null}

        {loading && !data ? (
          <>
            <StatsGridSkeleton cards={4} />
            <FiltersSkeleton controls={2} />
            <TableSkeleton columns={6} rows={6} />
          </>
        ) : null}

        {!(loading && !data) ? (
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
        ) : null}

        {!loading && error ? <p className="text-red-600">{mensajeError}</p> : null}

        {!loading && !error ? (
          <>
            <section className={`${panelBaseClass} overflow-x-auto !bg-white !p-0`}>
              {cargandoResumen ? (
                <div className="px-6 py-6">
                  <TableSkeleton columns={6} rows={4} />
                </div>
              ) : null}

              {!cargandoResumen ? (
                <div className="space-y-4 p-4 2xl:hidden">
                  {reportesVisibles.length > 0 ? (
                    reportesVisibles.map((reporte) => (
                    <article
                      className="cursor-pointer rounded-[1.4rem] border border-slate-100 bg-slate-50/70 p-4 transition hover:bg-slate-50"
                      key={reporte.id}
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
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-800">
                              {reporte.description || "Actividad sin descripcion"}
                            </p>
                            <p className="mt-1 text-sm text-slate-400">
                              Reporte #{reporte.id}
                            </p>
                          </div>
                          <BadgeEstadoReporte estado={reporte.status} />
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Categoria</p>
                            <p className="mt-1 text-sm font-medium text-slate-700">
                              {reporte.category?.name ?? "Sin categoria"}
                            </p>
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Horas</p>
                            <p className="mt-1 text-sm font-semibold text-slate-800">
                              {formatHoras(reporte.hours_spent)}
                            </p>
                          </div>
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-400">Fecha</p>
                            <p className="mt-1 text-sm text-slate-600">
                              {formatFecha(reporte.created_at)}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2">
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
                      </article>
                    ))
                  ) : (
                    <div className="px-2 py-6 text-sm text-slate-500">
                      No se encontraron reportes para este filtro.
                    </div>
                  )}
                </div>
              ) : null}

              <div className="hidden 2xl:block min-w-[860px]">
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
              total={totalVisible}
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
