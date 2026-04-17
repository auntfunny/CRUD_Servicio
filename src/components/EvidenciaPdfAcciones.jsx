function EvidenciaPdfAcciones({ className = "", linkClassName = "", reporteId }) {
  if (!reporteId) return null;

  const streamUrl = `/api/v1/reports/${reporteId}/evidence/stream`;

  return (
    <div className={`flex flex-wrap gap-3 ${className}`.trim()}>
      <a
        className={`inline-flex min-w-[150px] items-center justify-center rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:text-slate-800 ${linkClassName}`.trim()}
        href={streamUrl}
        rel="noreferrer"
        target="_blank"
      >
        Ver evidencia
      </a>
    </div>
  );
}

export default EvidenciaPdfAcciones;
