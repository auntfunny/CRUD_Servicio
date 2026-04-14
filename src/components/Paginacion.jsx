function crearPaginasVisibles(paginaActual, totalPaginas, maximoBotones) {
  if (totalPaginas <= maximoBotones) {
    return Array.from({ length: totalPaginas }, (_, indice) => indice + 1);
  }

  const mitad = Math.floor(maximoBotones / 2);
  let inicio = Math.max(1, paginaActual - mitad);
  let fin = inicio + maximoBotones - 1;

  if (fin > totalPaginas) {
    fin = totalPaginas;
    inicio = fin - maximoBotones + 1;
  }

  return Array.from({ length: fin - inicio + 1 }, (_, indice) => inicio + indice);
}

function Paginacion({
  page,
  page_size,
  total,
  totalPages,
  loading = false,
  maximoBotones = 6,
  onPageChange,
}) {
  const totalPaginasCalculado = totalPages ?? Math.max(1, Math.ceil(total / page_size));
  const paginasVisibles = crearPaginasVisibles(page, totalPaginasCalculado, maximoBotones);
  const puedeRetroceder = page > 1 && !loading;
  const puedeAvanzar = page < totalPaginasCalculado && !loading;

  return (
    <div className="flex flex-col gap-4 border-t border-acc1/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <div className="font-montserrat text-sm text-acc2/70">
        Mostrando pagina {page} de {totalPaginasCalculado}.
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          className="rounded-full border border-acc1/20 px-5 py-3 font-montserrat text-sm font-semibold text-acc2 transition hover:border-acc1 hover:text-acc1 disabled:cursor-not-allowed disabled:opacity-40"
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
              className={`h-12 w-12 rounded-full font-montserrat text-sm font-semibold transition ${
                activa
                  ? "bg-acc1 text-white shadow-lg"
                  : "border border-acc1/20 text-acc2 hover:border-acc1 hover:text-acc1"
              }`}
              onClick={() => onPageChange(numeroPagina)}
              type="button"
            >
              {numeroPagina}
            </button>
          );
        })}

        <button
          className="rounded-full border border-acc1/20 px-5 py-3 font-montserrat text-sm font-semibold text-acc2 transition hover:border-acc1 hover:text-acc1 disabled:cursor-not-allowed disabled:opacity-40"
          disabled={!puedeAvanzar}
          onClick={() => onPageChange(page + 1)}
          type="button"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

export default Paginacion;
