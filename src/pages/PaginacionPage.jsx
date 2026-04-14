import { useMemo, useState } from "react";
import Paginacion from "../components/Paginacion";

const reportesLocales = [
  { id: 1, status: "PENDING", student: { full_name: "Ana Garcia" } },
  { id: 2, status: "APPROVED_FULL", student: { full_name: "Luis Perez" } },
  { id: 3, status: "REJECTED", student: { full_name: "Carla Mena" } },
  { id: 4, status: "APPROVED_PARTIAL", student: { full_name: "Mateo Rojas" } },
  { id: 5, status: "PENDING", student: { full_name: "Diana Torres" } },
  { id: 6, status: "APPROVED_FULL", student: { full_name: "Jorge Vera" } },
  { id: 7, status: "REJECTED", student: { full_name: "Emily Castro" } },
  { id: 8, status: "PENDING", student: { full_name: "Carlos Ruiz" } },
  { id: 9, status: "APPROVED_PARTIAL", student: { full_name: "Majo Suarez" } },
  { id: 10, status: "APPROVED_FULL", student: { full_name: "Kevin Leon" } },
  { id: 11, status: "PENDING", student: { full_name: "Sofia Mendoza" } },
  { id: 12, status: "REJECTED", student: { full_name: "Daniel Cevallos" } },
];

const etiquetasEstado = {
  PENDING: "Pendiente",
  APPROVED_FULL: "Aprobado",
  APPROVED_PARTIAL: "Aprobado parcial",
  REJECTED: "Rechazado",
};

function PaginacionPage() {
  const [estado, setEstado] = useState("");
  const [page, setPage] = useState(1);
  const [cantidadPorPagina, setCantidadPorPagina] = useState(5);

  const registrosFiltrados = useMemo(() => {
    if (!estado) {
      return reportesLocales;
    }

    return reportesLocales.filter((item) => item.status === estado);
  }, [estado]);

  const totalMostrado = registrosFiltrados.length;
  const totalPaginasMostrado = Math.max(1, Math.ceil(totalMostrado / cantidadPorPagina));

  const registros = useMemo(() => {
    const inicio = (page - 1) * cantidadPorPagina;
    const fin = inicio + cantidadPorPagina;
    return registrosFiltrados.slice(inicio, fin);
  }, [page, cantidadPorPagina, registrosFiltrados]);

  const manejarCambioEstado = ({ target }) => {
    const valor = target.value;
    setEstado(valor);
    setPage(1);
  };

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginasMostrado) return;
    setPage(nuevaPagina);
  };

  const cambiarCantidadPorPagina = (nuevaCantidad) => {
    setPage(1);
    setCantidadPorPagina(Number(nuevaCantidad));
  };

  return (
    <main className="mx-auto max-w-3xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Paginación</h1>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <select
          className="rounded border px-3 py-2"
          onChange={manejarCambioEstado}
          value={estado}
        >
          <option value="">Todos</option>
          <option value="PENDING">Pendiente</option>
          <option value="APPROVED_FULL">Aprobado</option>
          <option value="APPROVED_PARTIAL">Aprobado parcial</option>
          <option value="REJECTED">Rechazado</option>
        </select>

        <select
          className="rounded border px-3 py-2"
          onChange={(evento) => cambiarCantidadPorPagina(evento.target.value)}
          value={cantidadPorPagina}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
      </div>

      <div className="mb-4 text-sm text-slate-600">
        <p>Total: {totalMostrado}</p>
        <p>Página actual: {page}</p>
      </div>

      <ul className="space-y-2">
        {registros.map((item) => (
          <li
            key={item.id}
            className="rounded border px-4 py-3"
          >
            <p className="font-semibold">#{item.id}</p>
            <p>{item.student?.full_name ?? "Sin nombre"}</p>
            <p className="text-sm text-slate-600">
              {etiquetasEstado[item.status] ?? item.status}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <Paginacion
          loading={false}
          onPageChange={cambiarPagina}
          page={page}
          page_size={cantidadPorPagina}
          total={totalMostrado}
          totalPages={totalPaginasMostrado}
        />
      </div>
    </main>
  );
}

export default PaginacionPage;
