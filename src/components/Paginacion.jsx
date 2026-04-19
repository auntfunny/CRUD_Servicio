function construirPaginasVisibles(page, totalPages, maximoBotones = 5) {
  const inicio = Math.max(
    1,
    Math.min(page - 2, totalPages - maximoBotones + 1),
  );
  const fin = Math.min(totalPages, inicio + maximoBotones - 1);

  return Array.from(
    { length: fin - inicio + 1 },
    (_, indice) => inicio + indice,
  );
}

function Paginacion({ page = 1, page_size = 10, total = 0, onPageChange }) {
  const totalPages = Math.max(1, Math.ceil(total / page_size));
  const paginasVisibles = construirPaginasVisibles(page, totalPages);
  const puedeRetroceder = page > 1;
  const puedeAvanzar = page < totalPages;

  if (typeof onPageChange !== "function") {
    return <p className="text-sm text-red-600">Debes enviar onPageChange.</p>;
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium text-slate-500">
        {total > 0
          ? `Mostrando pagina ${page} de ${totalPages}`
          : `Pagina ${page} de ${totalPages}`}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <button
          className="rounded-full border border-transparent bg-white/72 px-4 py-2 text-sm font-semibold text-slate-600 shadow-[0_8px_18px_rgba(15,23,42,0.04)] transition hover:border-[rgba(42,125,225,0.2)] hover:text-[var(--color-acc2)] disabled:cursor-not-allowed disabled:opacity-35"
          disabled={!puedeRetroceder}
          onClick={() => onPageChange(page - 1)}
          type="button"
        >
          <span className="hidden md:inline">Anterior</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="2.5"
            stroke="currentColor"
            className="md:hidden size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
            />
          </svg>
        </button>

        <div className="flex flex-wrap items-center gap-2">
          {paginasVisibles.map((numeroPagina) => {
            const activa = numeroPagina === page;

            return (
              <button
                key={numeroPagina}
                className={`h-10 min-w-10 rounded-full px-3 text-sm font-semibold shadow-[0_8px_18px_rgba(15,23,42,0.04)] transition ${
                  activa
                    ? "bg-[var(--color-acc1)] text-white"
                    : "bg-white/72 text-slate-600 hover:text-[var(--color-acc2)]"
                }`}
                onClick={() => onPageChange(numeroPagina)}
                type="button"
              >
                {numeroPagina}
              </button>
            );
          })}
        </div>

        <button
          className="rounded-full border border-transparent bg-white/72 px-4 py-2 text-sm font-semibold text-slate-600 shadow-[0_8px_18px_rgba(15,23,42,0.04)] transition hover:border-[rgba(42,125,225,0.2)] hover:text-[var(--color-acc2)] disabled:cursor-not-allowed disabled:opacity-35"
          disabled={!puedeAvanzar}
          onClick={() => onPageChange(page + 1)}
          type="button"
        >
          <span className="hidden md:inline">Siguiente</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="md:hidden size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Paginacion;
