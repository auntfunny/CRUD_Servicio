import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import BadgeEstadoReporte from "../components/BadgeEstadoReporte";
import ReporteDetalleModal from "../components/ReporteDetalleModal";
import { PageShell, panelBaseClass } from "../components/PageShell";
import useAxios from "../hooks/useAxios";
import { formatFecha, formatHoras } from "../utils/reportes";

function KpiCard({ helper, label, tone, value }) {
  return (
    <article className="rounded-[1.55rem] border border-slate-100 bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </p>
      <p className="mt-4 font-montserrat text-4xl font-bold leading-none text-slate-800">
        {value}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-500">{helper}</p>
      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full w-24 rounded-full ${tone}`} />
      </div>
    </article>
  );
}

function DashboardEstudiante() {
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const { data, loading, error } = useAxios("/dashboard/stats");
  const { data: reportesData, loading: loadingReportes } = useAxios("/reports/", {
    params: {
      page: 1,
      page_size: 5,
    },
  });

  const { reportes, progresoCurso, categoriasTop } = useMemo(() => {
    if (!data) return { categoriasTop: [], progresoCurso: null, reportes: null };

    return {
      reportes: {
        total: data.reports.total,
        pendientes: data.reports.pending,
        aprobados: data.reports.approved,
        rechazados: data.reports.rejected,
        horasPresentadas: data.reports.total_hours_submitted,
        horasAprobadas: data.reports.total_hours_approved,
      },
      progresoCurso: {
        nombre: data.course_progress.course_name,
        horasRequeridas: data.course_progress.required_service_hours,
        horasAprobadas: data.course_progress.hours_approved,
        horasRestantes: data.course_progress.hours_remaining,
        porcentaje: data.course_progress.progress_percentage,
      },
      categoriasTop: data.top_categories.map((cat) => ({
        id: cat.id,
        horasAprobadas: cat.total_hours_approved,
        nombre: cat.name,
        totalReportes: cat.total_reports,
      })),
    };
  }, [data]);

  const reportesRecientes = Array.isArray(reportesData?.items)
    ? reportesData.items
    : Array.isArray(reportesData?.data)
      ? reportesData.data
      : Array.isArray(reportesData?.results)
        ? reportesData.results
        : Array.isArray(reportesData)
          ? reportesData
          : [];

  const abrirDetalle = (reporte) => setReporteSeleccionado(reporte);
  const cerrarDetalle = () => setReporteSeleccionado(null);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center rounded-[2rem] border border-slate-200 bg-white text-slate-500 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
        Cargando dashboard...
      </div>
    );
  }

  if (error || !reportes || !progresoCurso) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center rounded-[2rem] border border-red-100 bg-white text-red-500 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
        Error al cargar los datos
      </div>
    );
  }

  const kpis = [
    {
      label: "Horas completadas",
      value: progresoCurso.horasAprobadas,
      helper: `${progresoCurso.horasRestantes} horas pendientes para cerrar el requisito`,
      tone: "bg-[linear-gradient(90deg,_#f4b740,_#e59b14)]",
    },
    {
      label: "Horas pendientes",
      value: progresoCurso.horasRestantes,
      helper: `${progresoCurso.horasRequeridas} horas requeridas en total`,
      tone: "bg-[linear-gradient(90deg,_#5fc4a6,_#3fa382)]",
    },
    {
      label: "Reportes enviados",
      value: reportes.total,
      helper: `${reportes.pendientes} siguen en revision`,
      tone: "bg-[linear-gradient(90deg,_#6da8ff,_#3d7dde)]",
    },
    {
      label: "Reportes aprobados",
      value: reportes.aprobados,
      helper: `${reportes.horasAprobadas} horas ya validadas`,
      tone: "bg-[linear-gradient(90deg,_#63c4a3,_#37a57f)]",
    },
  ];

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl space-y-6 p-6">
        <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--color-acc1)]">
              Dashboard
            </p>
            <h1 className="mt-2 text-4xl font-semibold text-slate-900">
              Seguimiento de servicio
            </h1>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition hover:border-slate-300 hover:bg-slate-50" to="/estudiante/reportes">
              Mis reportes
            </Link>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.label} {...kpi} />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.45fr_0.75fr]">
          <article className={`${panelBaseClass} !bg-white`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Tus reportes recientes</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Consulta rapidamente tus ultimos envios y abre el detalle cuando lo necesites.
                </p>
              </div>
              <Link className="text-sm font-semibold text-[#1958df]" to="/estudiante/reportes">
                Ver todo
              </Link>
            </div>

            <div className="mt-6 overflow-x-auto">
              <div className="min-w-[720px] overflow-hidden rounded-[1.6rem] border border-slate-100">
                <div className="grid grid-cols-[1.5fr_1fr_0.9fr_0.8fr_0.7fr] gap-4 bg-slate-50/90 px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  <span>Actividad</span>
                  <span>Categoria</span>
                  <span>Horas</span>
                  <span>Fecha</span>
                  <span>Accion</span>
                </div>

                {loadingReportes ? (
                  <div className="px-5 py-8 text-sm text-slate-500">Cargando reportes...</div>
                ) : reportesRecientes.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {reportesRecientes.map((reporte) => (
                      <div key={reporte.id} className="grid grid-cols-[1.5fr_1fr_0.9fr_0.8fr_0.7fr] items-center gap-4 px-5 py-4 text-sm text-slate-600">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-800">
                            {reporte.description || "Actividad sin descripcion"}
                          </p>
                          <div className="mt-2">
                            <BadgeEstadoReporte estado={reporte.status} />
                          </div>
                        </div>
                        <p className="truncate font-medium text-slate-700">
                          {reporte.category?.name ?? "Sin categoria"}
                        </p>
                        <p className="font-semibold text-slate-800">{formatHoras(reporte.hours_spent)}</p>
                        <p>{formatFecha(reporte.created_at)}</p>
                        <div>
                          <button
                            className="inline-flex items-center justify-center rounded-full bg-[#eef5ff] px-4 py-2 text-xs font-semibold text-[#1958df] transition hover:bg-[#e0ecff]"
                            onClick={() => abrirDetalle(reporte)}
                            type="button"
                          >
                            Ver
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-10 text-sm text-slate-500">
                    Aun no tienes reportes registrados.
                  </div>
                )}
              </div>
            </div>
          </article>

          <aside className={`${panelBaseClass} !bg-white`}>
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Progreso de servicio</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {progresoCurso.horasAprobadas} de {progresoCurso.horasRequeridas} horas completadas.
              </p>
            </div>

            <div className="mt-8 flex justify-center">
              <div
                className="relative flex h-64 w-64 items-center justify-center rounded-full"
                style={{
                  background: `conic-gradient(#63c4a3 0% ${progresoCurso.porcentaje}%, #f4b740 ${progresoCurso.porcentaje}% ${Math.min(progresoCurso.porcentaje + 8, 100)}%, rgba(226,232,240,0.72) ${Math.min(progresoCurso.porcentaje + 8, 100)}% 100%)`,
                }}
              >
                <div className="absolute h-48 w-48 rounded-full bg-white shadow-inner" />
                <div className="relative z-10 text-center">
                  <p className="font-montserrat text-5xl font-bold text-slate-800">
                    {progresoCurso.horasAprobadas}
                    <span className="text-3xl text-slate-400">/{progresoCurso.horasRequeridas}</span>
                  </p>
                  <p className="mt-2 text-xl font-semibold text-slate-600">horas</p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-[1.4rem] bg-slate-50/90 p-4">
              <p className="text-sm leading-6 text-slate-500">
                Te faltan <span className="font-semibold text-slate-800">{progresoCurso.horasRestantes} horas</span> para completar el requisito.
              </p>
              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,_#4f8df7,_#2a6ddd)]"
                  style={{ width: `${progresoCurso.porcentaje}%` }}
                />
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <Link className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50" to="/estudiante/reportes">
                Ver mis reportes
              </Link>
            </div>
          </aside>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <article className={`${panelBaseClass} !bg-white`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-slate-900">Categorias destacadas</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Espacios donde has tenido mayor actividad reportada.
                </p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {categoriasTop.length > 0 ? categoriasTop.map((categoria, index) => (
                <div key={categoria.id} className="flex items-start gap-4 rounded-[1.4rem] border border-slate-100 bg-slate-50/70 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eef5ff] font-montserrat text-sm font-bold text-[#1958df]">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-800">{categoria.nombre}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {categoria.totalReportes} reportes enviados
                    </p>
                    <p className="mt-1 text-sm text-slate-400">
                      {categoria.horasAprobadas} horas aprobadas
                    </p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-slate-500">Sin categorias registradas todavia.</p>
              )}
            </div>
          </article>

          <article className={`${panelBaseClass} !bg-white`}>
            <h2 className="text-xl font-semibold text-slate-900">Estado de tus reportes</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Distribucion actual de tus envios y horas validadas.
            </p>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.4rem] bg-amber-50/70 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">Pendientes</p>
                <p className="mt-3 font-montserrat text-4xl font-bold text-slate-800">{reportes.pendientes}</p>
                <p className="mt-2 text-sm text-slate-500">Esperando revision administrativa</p>
              </div>
              <div className="rounded-[1.4rem] bg-emerald-50/70 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Aprobados</p>
                <p className="mt-3 font-montserrat text-4xl font-bold text-slate-800">{reportes.aprobados}</p>
                <p className="mt-2 text-sm text-slate-500">Reportes ya validados</p>
              </div>
              <div className="rounded-[1.4rem] bg-rose-50/70 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-700">Rechazados</p>
                <p className="mt-3 font-montserrat text-4xl font-bold text-slate-800">{reportes.rechazados}</p>
                <p className="mt-2 text-sm text-slate-500">Reportes con correccion solicitada</p>
              </div>
              <div className="rounded-[1.4rem] bg-[#eef5ff] p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#1958df]">Horas presentadas</p>
                <p className="mt-3 font-montserrat text-4xl font-bold text-slate-800">{reportes.horasPresentadas}</p>
                <p className="mt-2 text-sm text-slate-500">Horas enviadas en total</p>
              </div>
            </div>
          </article>
        </section>

        {reporteSeleccionado ? (
          <ReporteDetalleModal
            onClose={cerrarDetalle}
            reporte={reporteSeleccionado}
          />
        ) : null}
      </div>
    </PageShell>
  );
}

export default DashboardEstudiante;
