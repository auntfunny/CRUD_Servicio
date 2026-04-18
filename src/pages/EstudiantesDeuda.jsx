import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import Paginacion from "../components/Paginacion";
import { PageShell, controlClass, panelBaseClass, primaryButtonClass } from "../components/PageShell";
import { ListPageSkeleton } from "../components/SkeletonBlocks";
import useAxios from "../hooks/useAxios";

function getNombreEstudiante(item) {
  return (
    item.full_name ??
    item.name ??
    `${item.first_name ?? ""} ${item.last_name ?? ""}`.trim() ??
    ""
  );
}

function getHorasRequeridas(item) {
  return Number(
    item.required_hours ??
      item.hours_required ??
      item.required_service_hours ??
      item.total_required_hours ??
      0,
  );
}

function getHorasAprobadas(item) {
  return Number(
    item.approved_hours ??
      item.hours_approved ??
      item.total_approved_hours ??
      0,
  );
}

function getHorasFaltantes(item) {
  const valor = item.missing_hours ?? item.hours_missing ?? item.remaining_hours;
  if (valor !== undefined && valor !== null) return Number(valor);
  return Math.max(0, getHorasRequeridas(item) - getHorasAprobadas(item));
}

function EstudiantesDeuda() {
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [busqueda, setBusqueda] = useState("");
  const [ordenActual, setOrdenActual] = useState("faltantes-desc");

  const { data, error, loading } = useAxios("/users/in-debt", {
    params: { page, page_size: pageSize },
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
      if (!textoBusqueda) return true;
      const nombre = getNombreEstudiante(estudiante).toLowerCase();
      const email = String(estudiante.email ?? "").toLowerCase();
      return nombre.includes(textoBusqueda) || email.includes(textoBusqueda);
    });

    return [...listaFiltrada].sort((a, b) => {
      if (ordenActual === "nombre-asc") {
        return getNombreEstudiante(a).localeCompare(getNombreEstudiante(b));
      }
      const diferenciaFaltantes = getHorasFaltantes(a) - getHorasFaltantes(b);
      return ordenActual === "faltantes-desc" ? -diferenciaFaltantes : diferenciaFaltantes;
    });
  }, [busqueda, estudiantes, ordenActual]);

  const total = data?.total ?? estudiantes.length;
  const mensajeError = error?.response?.data?.detail?.[0]?.msg ?? "No se pudieron cargar los estudiantes con horas pendientes.";

  return (
    <PageShell>
      {loading && !data ? <ListPageSkeleton columns={5} filters={2} rows={6} /> : null}

      <div className={`mx-auto max-w-7xl space-y-6 p-6 ${loading && !data ? "hidden" : ""}`}>
        <section className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-[0.18em] text-[var(--color-acc1)]">Seguimiento</p>
            <h1 className="mt-2 text-4xl font-semibold text-slate-900">Estudiantes con horas pendientes</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Consulta rapidamente quienes aun no completan sus horas de servicio.
            </p>
          </div>

          <Link className={primaryButtonClass} to="/reportes">Volver a reportes</Link>
        </section>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
          <span><span className="font-semibold text-slate-800">Total:</span> {total}</span>
          <span><span className="font-semibold text-slate-800">Mayor deuda:</span> {estudiantesVisibles[0] ? getHorasFaltantes(estudiantesVisibles[0]) : 0}</span>
          <span><span className="font-semibold text-slate-800">Promedio:</span> {estudiantesVisibles.length ? Math.round(estudiantesVisibles.reduce((acc, item) => acc + getHorasFaltantes(item), 0) / estudiantesVisibles.length) : 0}</span>
          <span><span className="font-semibold text-slate-800">En pagina:</span> {estudiantesVisibles.length}</span>
        </div>

        <section className={`${panelBaseClass} !bg-white`}>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Buscar
              <input
                className={controlClass}
                onChange={(evento) => setBusqueda(evento.target.value)}
                placeholder="Nombre o correo"
                type="text"
                value={busqueda}
              />
            </label>

            <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
              Ordenar por
              <select className={controlClass} onChange={(evento) => setOrdenActual(evento.target.value)} value={ordenActual}>
                <option value="faltantes-desc">Mas horas faltantes</option>
                <option value="faltantes-asc">Menos horas faltantes</option>
                <option value="nombre-asc">Nombre A-Z</option>
              </select>
            </label>
          </div>
        </section>

        {loading ? <p className="text-sm text-slate-500">Cargando estudiantes...</p> : null}
        {!loading && error ? <p className="text-red-600">{mensajeError}</p> : null}

        {!loading && !error ? (
          <>
            <section className={`${panelBaseClass} overflow-x-auto !bg-white !p-0`}>
              <div className="min-w-[900px]">
                <div className="grid grid-cols-[1.35fr_1.2fr_0.75fr_0.75fr_0.75fr] gap-4 border-b border-slate-100 bg-slate-50/90 px-6 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                  <span>Estudiante</span>
                  <span>Email</span>
                  <span>Requeridas</span>
                  <span>Aprobadas</span>
                  <span>Faltantes</span>
                </div>

                {estudiantesVisibles.length === 0 ? (
                  <div className="px-6 py-10 text-sm text-slate-500">No hay estudiantes pendientes.</div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {estudiantesVisibles.map((estudiante) => (
                      <div key={estudiante.id ?? `${estudiante.email}-${getNombreEstudiante(estudiante)}`} className="grid grid-cols-[1.35fr_1.2fr_0.75fr_0.75fr_0.75fr] items-center gap-4 px-6 py-4 text-sm text-slate-600 transition hover:bg-slate-50/60">
                        <p className="truncate font-semibold text-slate-800">{getNombreEstudiante(estudiante)}</p>
                        <p className="truncate">{estudiante.email ?? "Sin correo"}</p>
                        <p>{getHorasRequeridas(estudiante)}</p>
                        <p>{getHorasAprobadas(estudiante)}</p>
                        <span className="w-fit rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600">
                          {getHorasFaltantes(estudiante)} horas
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <Paginacion onPageChange={setPage} page={page} page_size={pageSize} total={total} />
          </>
        ) : null}
      </div>
    </PageShell>
  );
}

export default EstudiantesDeuda;
