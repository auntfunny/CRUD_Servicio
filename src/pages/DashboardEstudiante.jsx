import { useNavigate } from "react-router-dom";
import TarjetaEstadistica from "../components/TarjetaEstadistica";
import FilaCategoria from "../components/FilaCategoria";

// datos de la API
const datosEstudiante = {
  reportes: {
    total: 1,
    pendientes: 1,
    aprobados: 0,
    rechazados: 0,
    horas_presentadas: 5,
    horas_aprobadas: 0,
    tasa_de_aprobación: 0,
  },
  progreso_curso: {
    id_curso: 32,
    nombre_curso: "Desarrollo Web",
    horas_servicio_requeridas: 60,
    horas_aprobadas: 0,
    horas_restantes: 60,
    porcentaje_progreso: 0,
  },
  categorias_top: [
    {
      id: 1,
      nombre: "Visita al templo",
      total_reportes: 1,
      horas_aprobadas: 0,
    },
    { id: 2, nombre: "Indexación", total_reportes: 3, horas_aprobadas: 3 },
  ],
};

// Componente principal.
export default function DashboardEstudiante() {
  const navigate = useNavigate();
  const { reportes, progreso_curso, categorias_top } = datosEstudiante;

  return (
    <div className="bg-gray-50 min-h-screen px-6 py-8 max-w-5xl mx-auto">
      {/* Acciones rápidas */}
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
        Acciones rápidas
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
        <button className="bg-[#ff9e18] text-[#003764] font-bold rounded-2xl py-4 px-5 text-sm flex items-center gap-3 shadow hover:brightness-95 transition">
          <span className="text-lg">＋</span> Nuevo reporte
        </button>
        <button
          className="bg-[#2a7de1] text-white font-bold rounded-2xl py-4 px-5 text-sm flex items-center gap-3 shadow hover:brightness-95 transition"
          type="button"
          onClick={() => navigate("/estudiante/reportes")}
        >
          <span className="text-lg">📋</span> Mis reportes
        </button>
        <button className="bg-[#003764] text-white font-bold rounded-2xl py-4 px-5 text-sm flex items-center gap-3 shadow hover:brightness-95 transition">
          <span className="text-lg">📈</span> Progreso del curso
        </button>
      </div>

      {/* Progreso del curso */}
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
        Progreso del curso
      </p>
      <div className="bg-[#003764] rounded-2xl p-6 shadow-lg text-white mb-8">
        <h2 className="text-2xl font-extrabold mb-1">
          {progreso_curso.nombre_curso}
        </h2>
        <p className="text-sm text-white/60 mb-5">
          Horas de servicio requeridas:{" "}
          {progreso_curso.horas_servicio_requeridas} hrs
        </p>

        <div className="flex gap-8 mb-5">
          <div>
            <p className="text-3xl font-extrabold text-[#ff9e18]">
              {progreso_curso.horas_aprobadas}
            </p>
            <p className="text-[10px] uppercase tracking-wide text-white/50 font-semibold mt-1">
              Horas aprobadas
            </p>
          </div>
          <div>
            <p className="text-3xl font-extrabold text-[#ff9e18]">
              {progreso_curso.horas_restantes}
            </p>
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
      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
        Mis reportes
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
        <TarjetaEstadistica
          valor={reportes.total}
          etiqueta="Total reportes"
          colorBorde="border-[#2a7de1]"
        />
        <TarjetaEstadistica
          valor={reportes.pendientes}
          etiqueta="Pendientes"
          colorBorde="border-[#ff9e18]"
        />
        <TarjetaEstadistica
          valor={reportes.aprobados}
          etiqueta="Aprobados"
          colorBorde="border-green-500"
        />
        <TarjetaEstadistica
          valor={reportes.rechazados}
          etiqueta="Rechazados"
          colorBorde="border-red-400"
        />
        <TarjetaEstadistica
          valor={reportes.horas_presentadas}
          etiqueta="Horas presentadas"
          colorBorde="border-[#003764]"
        />
        <TarjetaEstadistica
          valor={reportes.horas_aprobadas}
          etiqueta="Horas aprobadas"
          colorBorde="border-green-500"
        />
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
