function construirPaginasVisibles(page, totalPages, maximoBotones = 5) {
  const inicio = Math.max(1, Math.min(page - 2, totalPages - maximoBotones + 1));
  const fin = Math.min(totalPages, inicio + maximoBotones - 1);

  return Array.from(
    { length: fin - inicio + 1 },
    (_, indice) => inicio + indice,
  );
}

function Paginacion({
  page = 1,
  page_size = 10,
  total = 0,
  onPageChange,
}) {
  const totalPages = Math.max(1, Math.ceil(total / page_size));
  const paginasVisibles = construirPaginasVisibles(page, totalPages);
  const puedeRetroceder = page > 1;
  const puedeAvanzar = page < totalPages;

  if (typeof onPageChange !== "function") {
    return <p className="text-sm text-red-600">Debes enviar onPageChange.</p>;
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-slate-500">
          Pagina {page} de {totalPages}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <button
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!puedeRetroceder}
            onClick={() => onPageChange(page - 1)}
            type="button"
          >
            Anterior
          </button>

          {paginasVisibles.map((numeroPagina) => {
            const activa = numeroPagina === page;

            return (
              <button
                key={numeroPagina}
                className={`h-10 min-w-10 rounded-full border px-3 text-sm font-semibold transition ${
                  activa
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50"
                }`}
                onClick={() => onPageChange(numeroPagina)}
                type="button"
              >
                {numeroPagina}
              </button>
            );
          })}

          <button
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
            disabled={!puedeAvanzar}
            onClick={() => onPageChange(page + 1)}
            type="button"
          >
            Siguiente
          </button>
        </div>
      </div>
    </div>
  );
}

export default Paginacion;
