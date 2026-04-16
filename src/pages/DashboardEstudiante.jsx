import TarjetaEstadistica from "../components/TarjetaEstadistica";
import FilaCategoria from "../components/FilaCategoria";
import { useMemo } from "react";
import useAxios from "../hooks/useAxios";

// Componente principal.
export default function DashboardEstudiante() {
  const { data, loading, error } = useAxios("/dashboard/stats");

// Mapeo de la API.
  const { reportes, progreso_curso, categorias_top } = useMemo(() => {
    if (!data) return { reportes: null, progreso_curso: null, categorias_top: [] };

 return {
      reportes: {
        total:             data.reports.total,
        pendientes:        data.reports.pending,
        aprobados:         data.reports.approved,
        rechazados:        data.reports.rejected,
        horas_presentadas: data.reports.total_hours_submitted,
        horas_aprobadas:   data.reports.total_hours_approved,
      },
      progreso_curso: {
        nombre_curso:             data.course_progress.course_name,
        horas_servicio_requeridas: data.course_progress.required_service_hours,
        horas_aprobadas:          data.course_progress.hours_approved,
        horas_restantes:          data.course_progress.hours_remaining,
        porcentaje_progreso:      data.course_progress.progress_percentage,
      },
      categorias_top: data.top_categories.map((cat) => ({
        id:            cat.id,
        nombre:        cat.name,
        total_reportes: cat.total_reports,
        horas_aprobadas: cat.total_hours_approved,
      })),
    };
  }, [data]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      Cargando...
    </div>
  );

  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 text-red-500">
      Error al cargar los datos
    </div>
  );

  if (!reportes) return null;
  return (
    <div className="bg-gray-50 min-h-screen px-6 py-8 max-w-5xl mx-auto">
      {/* Progreso del curso */}
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
        Progreso del curso
      </p>
      <div className="bg-[#003764] rounded-2xl p-6 shadow-lg text-white mb-8">
        <h2 className="text-2xl font-extrabold mb-1">{progreso_curso.nombre_curso}</h2>
        <p className="text-sm text-white/60 mb-5">
          Horas de servicio requeridas: {progreso_curso.horas_servicio_requeridas} hrs
        </p>

        <div className="flex gap-8 mb-5">
          <div>
            <p className="text-3xl font-extrabold text-[#ff9e18]">{progreso_curso.horas_aprobadas}</p>
            <p className="text-[10px] uppercase tracking-wide text-white/50 font-semibold mt-1">
              Horas aprobadas
            </p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-[#ff9e18]">{progreso_curso.horas_restantes}</p>
            <p className="text-[10px] uppercase tracking-wide text-white/50 font-semibold mt-1">
              Horas restantes
            </p>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="w-full bg-white/10 rounded-full h-2">
          <div
            className="bg-[#ff9e18] h-2 rounded-full"
            style={{ width: `${progreso_curso.porcentaje_progreso}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-white/40 font-semibold mt-1">
          <span>0 hrs</span>
          <span>{progreso_curso.porcentaje_progreso}% completado</span>
          <span>{progreso_curso.horas_servicio_requeridas} hrs</span>
        </div>
      </div>

        {/* Estadísticas de mis reportes */}
        <div className="flex justify-between items-center mb-3">
          <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
           Mis reportes
          </p>
          <button className="bg-[#ff9e18] text-[#003764] font-bold rounded-full px-5 py-2 text-xs flex items-center gap-2 shadow hover:brightness-95 transition">
          <span>＋</span> Nuevo reporte
          </button>
        </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        <TarjetaEstadistica valor={reportes.total}            etiqueta="Total reportes"    colorBorde="border-[#2a7de1]" />
        <TarjetaEstadistica valor={reportes.pendientes}        etiqueta="Pendientes"        colorBorde="border-[#ff9e18]" />
        <TarjetaEstadistica valor={reportes.aprobados}         etiqueta="Aprobados"         colorBorde="border-green-500" />
        <TarjetaEstadistica valor={reportes.rechazados}        etiqueta="Rechazados"        colorBorde="border-red-400"   />
        <TarjetaEstadistica valor={reportes.horas_presentadas} etiqueta="Horas presentadas" colorBorde="border-[#003764]" />
        <TarjetaEstadistica valor={reportes.horas_aprobadas}   etiqueta="Horas aprobadas"   colorBorde="border-green-500" />
      </div>

      {/* Categorías de servicio */}
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
        Mis categorías de servicio
      </p>
      <div className="flex flex-col gap-3">
        {categorias_top.map((cat) => (
          <FilaCategoria key={cat.id} {...cat} />
        ))}
      </div>

    </div>
  );
}
