import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import EstudianteDeudaCard from "../components/EstudianteDeudaCard";
import Paginacion from "../components/Paginacion";
import useAxios from "../hooks/useAxios";

function getNombreEstudiante(item) {
  return (
    item.full_name ??
    item.name ??
    `${item.first_name ?? ""} ${item.last_name ?? ""}`.trim() ??
    ""
  );
}

function getHorasFaltantes(item) {
  const valor = item.missing_hours ?? item.hours_missing ?? item.remaining_hours;

  if (valor !== undefined && valor !== null) {
    return Number(valor);
  }

  const requeridas = Number(
    item.required_hours ??
      item.hours_required ??
      item.required_service_hours ??
      item.total_required_hours ??
      0,
  );
  const aprobadas = Number(
    item.approved_hours ??
      item.hours_approved ??
      item.total_approved_hours ??
      0,
  );

  return Math.max(0, requeridas - aprobadas);
}

function EstudiantesDeuda() {
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [busqueda, setBusqueda] = useState("");
  const [ordenActual, setOrdenActual] = useState("faltantes-desc");

  const paramsConsulta = useMemo(
    () => ({
      page,
      page_size: pageSize,
    }),
    [page, pageSize],
  );

  const { data, error, loading } = useAxios("/users/in-debt", {
    params: paramsConsulta,
  });

  const estudiantes = Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.results)
        ? data.results
        : Array.isArray(data)
          ? data
          : [];

  const estudiantesVisibles = useMemo(() => {
    const textoBusqueda = busqueda.trim().toLowerCase();

    const listaFiltrada = estudiantes.filter((estudiante) => {
      if (!textoBusqueda) {
        return true;
      }

      const nombre = getNombreEstudiante(estudiante).toLowerCase();
      const email = String(estudiante.email ?? "").toLowerCase();

      return nombre.includes(textoBusqueda) || email.includes(textoBusqueda);
    });

    return [...listaFiltrada].sort((estudianteA, estudianteB) => {
      if (ordenActual === "nombre-asc") {
        return getNombreEstudiante(estudianteA).localeCompare(getNombreEstudiante(estudianteB));
      }

      const diferenciaFaltantes =
        getHorasFaltantes(estudianteA) - getHorasFaltantes(estudianteB);

      return ordenActual === "faltantes-desc" ? -diferenciaFaltantes : diferenciaFaltantes;
    });
  }, [busqueda, estudiantes, ordenActual]);

  const total = data?.total ?? estudiantes.length;
  const mensajeError =
    error?.response?.data?.detail?.[0]?.msg ??
    "No se pudieron cargar los estudiantes con horas pendientes.";

  return (
    <main className="mx-auto max-w-7xl p-6">
      <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Estudiantes con horas pendientes
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Revisa a quienes todavia no completan sus horas y cuanto les falta.
            </p>
          </div>

          <Link
            className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            to="/reportes"
          >
            Volver a reportes
          </Link>
        </div>
      </section>

      <section className="mb-6 grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Buscar
          <input
            className="rounded-2xl border border-slate-300 px-4 py-3"
            onChange={(evento) => setBusqueda(evento.target.value)}
            placeholder="Nombre o correo"
            type="text"
            value={busqueda}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Ordenar por
          <select
            className="rounded-2xl border border-slate-300 px-4 py-3"
            onChange={(evento) => setOrdenActual(evento.target.value)}
            value={ordenActual}
          >
            <option value="faltantes-desc">Mas horas faltantes</option>
            <option value="faltantes-asc">Menos horas faltantes</option>
            <option value="nombre-asc">Nombre A-Z</option>
          </select>
        </label>
      </section>

      {loading ? <p>Cargando estudiantes...</p> : null}
      {!loading && error ? <p className="text-red-600">{mensajeError}</p> : null}

      {!loading && !error ? (
        <>
          <section className="grid gap-4 md:grid-cols-2">
            {estudiantesVisibles.map((estudiante) => (
              <EstudianteDeudaCard
                key={estudiante.id ?? `${estudiante.email}-${getNombreEstudiante(estudiante)}`}
                estudiante={estudiante}
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
    </main>
  );
}

export default EstudiantesDeuda;
