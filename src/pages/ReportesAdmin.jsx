import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Paginacion from "../components/Paginacion";
import ReporteCard from "../components/ReporteCard";
import { useAuth } from "../context/AuthContext";
import useAxios from "../hooks/useAxios";
import { estadoOptions } from "../utils/reportes";

function ReportesAdmin() {
  const navigate = useNavigate();
  const { logout } = useAuth();

//Creamos estados para manejar la paginación
  const [page, setPage] = useState(1);
  const pageSize = 8;


  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [ordenActual, setOrdenActual] = useState("fecha-desc");


  // Para cargar los reportes, enviamos la pagina y el page_size como query params.
  const { data, error, loading } = useAxios("/reports/", {
    params: { page, page_size: pageSize },
  });


  const { data: categoriasData } = useAxios("/categories/");

  const reportes = data?.items ?? data?.data ?? [];
  const total = data?.total ?? 0;
  const categorias = categoriasData?.items ?? categoriasData?.data ?? categoriasData ?? [];
  const mensajeError =
    error?.response?.data?.detail?.[0]?.msg ??
    "No se pudieron cargar los reportes.";

  const reportesVisibles = useMemo(() => {
    const textoBusqueda = busqueda.trim().toLowerCase();

    const listaFiltrada = reportes.filter((reporte) => {
      const coincideEstado = estadoFiltro ? reporte.status === estadoFiltro : true;
      const coincideCategoria = categoriaFiltro
        ? String(reporte.category?.id ?? reporte.category_id ?? "") === categoriaFiltro
        : true;
      const nombreEstudiante = reporte.student?.full_name?.toLowerCase() ?? "";
      const nombreCategoria = reporte.category?.name?.toLowerCase() ?? "";
      const coincideBusqueda = textoBusqueda
        ? nombreEstudiante.includes(textoBusqueda) || nombreCategoria.includes(textoBusqueda)
        : true;

      return coincideEstado && coincideCategoria && coincideBusqueda;
    });

    return [...listaFiltrada].sort((reporteA, reporteB) => {
      if (ordenActual === "fecha-asc") {
        return new Date(reporteA.created_at) - new Date(reporteB.created_at);
      }

      if (ordenActual === "horas-desc") {
        return Number(reporteB.hours_spent ?? 0) - Number(reporteA.hours_spent ?? 0);
      }

      if (ordenActual === "horas-asc") {
        return Number(reporteA.hours_spent ?? 0) - Number(reporteB.hours_spent ?? 0);
      }

      if (ordenActual === "estudiante-asc") {
        return (reporteA.student?.full_name ?? "").localeCompare(reporteB.student?.full_name ?? "");
      }

      return new Date(reporteB.created_at) - new Date(reporteA.created_at);
    });
  }, [busqueda, categoriaFiltro, estadoFiltro, ordenActual, reportes]);

  return (
    <main className="mx-auto max-w-7xl p-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3 border p-4">
        <div>Panel admin</div>
        <div className="flex gap-2">
          <button className="rounded border px-4 py-2" onClick={() => navigate("/perfil")} type="button">
            Perfil
          </button>
          <button className="rounded border px-4 py-2" onClick={logout} type="button">
            Logout
          </button>
        </div>
      </header>

      <section className="mb-6 border p-4 text-center">
        <h1 className="text-2xl font-semibold">Reportes del admin</h1>
      </section>

      <section className="mb-6 grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2 xl:grid-cols-4">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Buscar
          <input
            className="rounded-2xl border border-slate-300 px-4 py-3"
            onChange={(evento) => setBusqueda(evento.target.value)}
            placeholder="Estudiante o categoria"
            type="text"
            value={busqueda}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Estado
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
          Categoria
          <select
            className="rounded-2xl border border-slate-300 px-4 py-3"
            onChange={(evento) => setCategoriaFiltro(evento.target.value)}
            value={categoriaFiltro}
          >
            <option value="">Todas</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={String(categoria.id)}>
                {categoria.name}
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
            <option value="estudiante-asc">Estudiante A-Z</option>
          </select>
        </label>
      </section>

      {loading ? <p>Cargando reportes...</p> : null}
      {!loading && error ? <p className="text-red-600">{mensajeError}</p> : null}

      {!loading && !error ? (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {reportesVisibles.map((reporte) => (
              <ReporteCard key={reporte.id} reporte={reporte} showStudent />
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
    </main>
  );
}

export default ReportesAdmin;
