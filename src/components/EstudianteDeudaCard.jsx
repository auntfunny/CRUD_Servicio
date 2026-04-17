import { cardBaseClass } from "./PageShell";

function getNombreEstudiante(item) {
  return (
    item.full_name ??
    item.name ??
    `${item.first_name ?? ""} ${item.last_name ?? ""}`.trim() ??
    "Sin nombre"
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
  const horasFaltantes = item.missing_hours ?? item.hours_missing ?? item.remaining_hours;

  if (horasFaltantes !== undefined && horasFaltantes !== null) {
    return Number(horasFaltantes);
  }

  return Math.max(0, getHorasRequeridas(item) - getHorasAprobadas(item));
}

function EstudianteDeudaCard({ estudiante }) {
  const nombre = getNombreEstudiante(estudiante);
  const email = estudiante.email ?? "Sin correo";
  const horasRequeridas = getHorasRequeridas(estudiante);
  const horasAprobadas = getHorasAprobadas(estudiante);
  const horasFaltantes = getHorasFaltantes(estudiante);

  return (
    <article className={`${cardBaseClass} text-left`}>
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Estudiante
          </p>
          <h3 className="mt-3 text-lg font-semibold text-[var(--color-acc2)]">{nombre}</h3>
          <p className="text-sm text-slate-500">{email}</p>
        </div>

        <div className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-sm font-semibold text-rose-600 shadow-[0_8px_18px_rgba(244,63,94,0.1)]">
          {horasFaltantes} horas faltantes
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-[1.25rem] bg-white/65 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Requeridas
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-800">{horasRequeridas}</p>
        </div>

        <div className="rounded-[1.25rem] bg-white/65 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Aprobadas
          </p>
          <p className="mt-2 text-lg font-semibold text-slate-800">{horasAprobadas}</p>
        </div>

        <div className="rounded-[1.25rem] bg-rose-50/90 p-4">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-rose-500">
            Faltantes
          </p>
          <p className="mt-2 text-lg font-semibold text-rose-600">{horasFaltantes}</p>
        </div>
      </div>
    </article>
  );
}

export default EstudianteDeudaCard;
