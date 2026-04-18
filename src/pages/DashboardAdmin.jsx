import { Link } from "react-router-dom";
import { useMemo } from "react";
import BadgeEstadoReporte from "../components/BadgeEstadoReporte";
import { PageShell, panelBaseClass, primaryButtonClass } from "../components/PageShell";
import { DashboardSkeleton } from "../components/SkeletonBlocks";
import useAxios from "../hooks/useAxios";
import { formatFecha, formatHoras } from "../utils/reportes";

function KpiCard({ helper, label, percentage, tone, value }) {
  return (
    <article className="rounded-[1.55rem] border border-slate-100 bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.05)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
          {label}
        </p>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
          {percentage}%
        </span>
      </div>
      <p className="mt-4 font-montserrat text-4xl font-bold leading-none text-slate-800">
        {value}
      </p>
      <p className="mt-3 text-sm leading-6 text-slate-500">{helper}</p>
      <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${tone}`} style={{ width: `${percentage}%` }} />
      </div>
    </article>
  );
}

function DashboardAdmin() {
  const { data, loading, error } = useAxios("/dashboard/stats");
  const { data: pendingData, loading: loadingPendientes } = useAxios("/reports/", {
    params: {
      page: 1,
      page_size: 5,
      status: "PENDING",
    },
  });

  const pendientes = Array.isArray(pendingData?.items)
    ? pendingData.items
    : Array.isArray(pendingData?.data)
      ? pendingData.data
      : Array.isArray(pendingData?.results)
        ? pendingData.results
        : Array.isArray(pendingData)
          ? pendingData
          : [];

  const resumen = useMemo(() => {
    if (!data) return null;

    const totalUsuarios = (data.users?.total_students ?? 0) + (data.users?.total_admins ?? 0);
    const totalReportes = data.reports?.total ?? 0;
    const totalPendientes = data.reports?.pending ?? 0;
    const totalAprobados = data.reports?.approved ?? 0;
    const totalRechazados = data.reports?.rejected ?? 0;
    const totalRevisados = totalAprobados + totalRechazados;
    const porcentajeEstudiantes = totalUsuarios > 0
      ? Math.round(((data.users?.total_students ?? 0) / totalUsuarios) * 100)
      : 0;

    return {
      categoriasTop: data.top_categories ?? [],
      cursosTop: data.top_courses ?? [],
      porcentajeAprobados: totalReportes > 0 ? Math.round((totalAprobados / totalReportes) * 100) : 0,
      porcentajeEstudiantes,
      porcentajePendientes: totalReportes > 0 ? Math.round((totalPendientes / totalReportes) * 100) : 0,
      porcentajeRevision: totalReportes > 0 ? Math.round((totalRevisados / totalReportes) * 100) : 0,
      totalAprobados,
      totalCategorias: data.top_categories?.length ?? 0,
      totalCursos: data.top_courses?.length ?? 0,
      totalPendientes,
      totalRechazados,
      totalReportes,
      totalUsuarios,
    };
  }, [data]);

  if (loading) {
    return <DashboardSkeleton />;
  }

  if (error || !resumen) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center rounded-[2rem] border border-red-100 bg-white text-red-500 shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
        Error cargando datos
      </div>
    );
  }

  const cards = [
    {
      label: "Usuarios",
      value: resumen.totalUsuarios,
      helper: `${data?.users?.total_students ?? 0} estudiantes y ${data?.users?.total_admins ?? 0} admins`,
      percentage: resumen.porcentajeEstudiantes,
      tone: "bg-[linear-gradient(90deg,_#4f8df7,_#2a6ddd)]",
    },
    {
      label: "Revision completa",
      value: `${resumen.porcentajeRevision}%`,
      helper: `${resumen.totalAprobados + resumen.totalRechazados} reportes ya revisados`,
      percentage: resumen.porcentajeRevision,
      tone: "bg-[linear-gradient(90deg,_#63c4a3,_#37a57f)]",
    },
    {
      label: "Pendientes",
      value: resumen.totalPendientes,
      helper: `${resumen.totalReportes} reportes registrados en total`,
      percentage: resumen.porcentajePendientes,
      tone: "bg-[linear-gradient(90deg,_#6da8ff,_#3d7dde)]",
    },
    {
      label: "Aprobados",
      value: resumen.totalAprobados,
      helper: `${resumen.totalCursos} cursos con actividad visible`,
      percentage: resumen.porcentajeAprobados,
      tone: "bg-[linear-gradient(90deg,_#f4b740,_#e59b14)]",
    },
  ];

  return (
    <PageShell>
      <div className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
        <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--color-acc1)]">
              Dashboard
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900 sm:text-4xl">
              Resumen administrativo
            </h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Supervisa el estado general del sistema y actua rapido sobre los reportes pendientes.
            </p>
          </div>

          <Link className={primaryButtonClass} to="/reportes">
            Revisar reportes
          </Link>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {cards.map((card) => (
            <KpiCard key={card.label} {...card} />
          ))}
        </section>

        <section className="grid gap-6 xl:grid-cols-4">
          <article className={`xl:col-span-3 ${panelBaseClass} !bg-white`}>
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-900">Reportes por revisar</h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Cola prioritaria de revision para el equipo administrativo.
                </p>
              </div>
              <Link className="text-sm font-semibold text-[#1958df]" to="/reportes">
                Ver todo
              </Link>
            </div>

            <div className="mt-6 overflow-x-auto">
              <div className="min-w-[840px] overflow-hidden rounded-[1.6rem] border border-slate-100">
                <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr_0.9fr_0.7fr] gap-4 bg-slate-50/90 px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  <span>Estudiante</span>
                  <span>Categoria</span>
                  <span>Horas</span>
                  <span>Fecha</span>
                  <span>Estado</span>
                  <span>Accion</span>
                </div>

                {loadingPendientes ? (
                  <div className="px-5 py-8 text-sm text-slate-500">Cargando reportes...</div>
                ) : pendientes.length > 0 ? (
                  <div className="divide-y divide-slate-100">
                    {pendientes.map((reporte) => (
                      <div key={reporte.id} className="grid grid-cols-[1.4fr_1fr_0.8fr_0.8fr_0.9fr_0.7fr] items-center gap-4 px-5 py-4 text-sm text-slate-600">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-800">
                            {reporte.student?.full_name ?? "Sin estudiante"}
                          </p>
                          <p className="mt-1 truncate text-xs text-slate-400">
                            {reporte.student?.email ?? "Sin correo"}
                          </p>
                        </div>
                        <p className="truncate font-medium text-slate-700">
                          {reporte.category?.name ?? "Sin categoria"}
                        </p>
                        <p className="font-semibold text-slate-800">{formatHoras(reporte.hours_spent)}</p>
                        <p>{formatFecha(reporte.created_at)}</p>
                        <BadgeEstadoReporte estado={reporte.status} />
                        <div>
                          <Link
                            className="inline-flex items-center justify-center rounded-full bg-[#eef5ff] px-4 py-2 text-xs font-semibold text-[#1958df] transition hover:bg-[#e0ecff]"
                            to="/reportes"
                          >
                            Revisar
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="px-5 py-10 text-sm text-slate-500">
                    No hay reportes pendientes en este momento.
                  </div>
                )}
              </div>
            </div>
          </article>

          <aside className={`xl:col-span-1 ${panelBaseClass} !bg-white`}>
            <div>
              <h2 className="text-2xl font-semibold text-slate-900">Resumen del flujo</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Estado actual de aprobaciones, rechazos y avance general.
              </p>
            </div>

            <div className="mt-6 space-y-3">
              <div className="rounded-[1.4rem] bg-amber-50/70 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-amber-700">Pendientes</p>
                <p className="mt-3 font-montserrat text-4xl font-bold text-slate-800">{resumen.totalPendientes}</p>
                <p className="mt-2 text-sm text-slate-500">Esperando revision</p>
              </div>
              <div className="rounded-[1.4rem] bg-emerald-50/70 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">Aprobados</p>
                <p className="mt-3 font-montserrat text-4xl font-bold text-slate-800">{resumen.totalAprobados}</p>
                <p className="mt-2 text-sm text-slate-500">Horas validadas</p>
              </div>
              <div className="rounded-[1.4rem] bg-rose-50/70 p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-700">Rechazados</p>
                <p className="mt-3 font-montserrat text-4xl font-bold text-slate-800">{resumen.totalRechazados}</p>
                <p className="mt-2 text-sm text-slate-500">Con observaciones</p>
              </div>
            </div>

            <div className="mt-6 rounded-[1.4rem] bg-slate-50/90 p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                    Progreso general
                  </p>
                  <p className="mt-3 font-montserrat text-4xl font-bold text-slate-800">
                    {resumen.porcentajeRevision}%
                  </p>
                </div>
                <p className="text-sm text-slate-500">del flujo revisado</p>
              </div>
              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,_#4f8df7,_#2a6ddd)]"
                  style={{ width: `${resumen.porcentajeRevision}%` }}
                />
              </div>
            </div>
          </aside>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <article className={`${panelBaseClass} !bg-white`}>
            <h2 className="text-xl font-semibold text-slate-900">Categorias destacadas</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Categorias con mayor volumen reciente de reportes.
            </p>
            <div className="mt-5 space-y-3">
              {resumen.categoriasTop.slice(0, 4).map((item, index) => (
                <div key={item.id} className="flex items-start gap-4 rounded-[1.4rem] border border-slate-100 bg-slate-50/70 p-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#eef5ff] font-montserrat text-sm font-bold text-[#1958df]">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-800">{item.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.total_reports} reportes enviados</p>
                    <p className="mt-1 text-sm text-slate-400">{item.total_hours_approved} horas aprobadas</p>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className={`${panelBaseClass} !bg-white`}>
            <h2 className="text-xl font-semibold text-slate-900">Cursos activos</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Cursos con actividad visible dentro del sistema.
            </p>
            <div className="mt-5 space-y-3">
              {resumen.cursosTop.slice(0, 4).map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 rounded-[1.4rem] border border-slate-100 bg-slate-50/70 p-4">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-800">{item.name}</p>
                    <p className="mt-1 text-sm text-slate-500">{item.total_students} estudiantes visibles</p>
                  </div>
                  <span className="rounded-full bg-[#eef5ff] px-3 py-1 text-xs font-semibold text-[#1958df]">
                    Activo
                  </span>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </PageShell>
  );
}

export default DashboardAdmin;
