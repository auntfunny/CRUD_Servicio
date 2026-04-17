const estados = {
  PENDING: {
    clases: "border-amber-200 bg-amber-50 text-amber-700",
    texto: "Pendiente",
  },
  APPROVED_FULL: {
    clases: "border-emerald-200 bg-emerald-50 text-emerald-700",
    texto: "Aprobado",
  },
  APPROVED_PARTIAL: {
    clases: "border-sky-200 bg-sky-50 text-sky-700",
    texto: "Aprobado parcial",
  },
  REJECTED: {
    clases: "border-rose-200 bg-rose-50 text-rose-700",
    texto: "Rechazado",
  },
};

function BadgeEstadoReporte({ className = "", estado }) {
  const config = estados[estado] ?? {
    clases: "border-slate-200 bg-slate-50 text-slate-700",
    texto: estado ?? "Sin estado",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${config.clases} ${className}`.trim()}
    >
      {config.texto}
    </span>
  );
}

export default BadgeEstadoReporte;
