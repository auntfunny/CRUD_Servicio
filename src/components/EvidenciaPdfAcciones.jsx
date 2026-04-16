function EvidenciaPdfAcciones({ reporteId }) {
  if (!reporteId) return null;

  const streamUrl = `/api/v1/reports/${reporteId}/evidence/stream`;

  return (
    <div className="flex flex-wrap gap-3">
      <a
        className="inline-flex rounded border px-3 py-2"
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
