import { useMemo, useState } from "react";
import Paginacion from "../components/Paginacion";

const cursosLocales = [
  { id: 1, nombre: "Desarrollo Web", nivel: "Basico", modalidad: "Virtual" },
  { id: 2, nombre: "Atencion al Cliente", nivel: "Intermedio", modalidad: "Presencial" },
  { id: 3, nombre: "Excel", nivel: "Basico", modalidad: "Virtual" },
  { id: 4, nombre: "Marketing Digital", nivel: "Intermedio", modalidad: "Virtual" },
  { id: 5, nombre: "Ingles", nivel: "Basico", modalidad: "Presencial" },
  { id: 6, nombre: "Diseno Grafico", nivel: "Avanzado", modalidad: "Virtual" },
  { id: 7, nombre: "Auxiliar de Farmacia", nivel: "Intermedio", modalidad: "Presencial" },
  { id: 8, nombre: "Redaccion", nivel: "Basico", modalidad: "Virtual" },
  { id: 9, nombre: "Programacion", nivel: "Avanzado", modalidad: "Virtual" },
  { id: 10, nombre: "Contabilidad", nivel: "Intermedio", modalidad: "Presencial" },
  { id: 11, nombre: "Oratoria", nivel: "Basico", modalidad: "Virtual" },
  { id: 12, nombre: "Diseno UX", nivel: "Avanzado", modalidad: "Virtual" },
];

function ListaCursosPage() {
  const [page, setPage] = useState(1);
  const [cantidadPorPagina, setCantidadPorPagina] = useState(4);

  const total = cursosLocales.length;
  const totalPaginas = Math.max(1, Math.ceil(total / cantidadPorPagina));

  const cursosVisibles = useMemo(() => {
    const inicio = (page - 1) * cantidadPorPagina;
    const fin = inicio + cantidadPorPagina;
    return cursosLocales.slice(inicio, fin);
  }, [page, cantidadPorPagina]);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina < 1 || nuevaPagina > totalPaginas) return;
    setPage(nuevaPagina);
  };

  const cambiarCantidadPorPagina = (nuevaCantidad) => {
    setPage(1);
    setCantidadPorPagina(Number(nuevaCantidad));
  };

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Lista de cursos</h1>

      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm text-slate-700" htmlFor="cantidad-cursos">
          Cursos por pagina
        </label>
        <select
          id="cantidad-cursos"
          className="rounded border px-3 py-2"
          onChange={(evento) => cambiarCantidadPorPagina(evento.target.value)}
          value={cantidadPorPagina}
        >
          <option value={4}>4</option>
          <option value={6}>6</option>
          <option value={8}>8</option>
        </select>
      </div>

      <div className="mb-4 text-sm text-slate-600">
        <p>Total de cursos: {total}</p>
        <p>Pagina actual: {page}</p>
      </div>

      <div className="overflow-hidden rounded border">
        <table className="w-full border-collapse">
          <thead className="bg-slate-100 text-left">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Curso</th>
              <th className="px-4 py-3">Nivel</th>
              <th className="px-4 py-3">Modalidad</th>
            </tr>
          </thead>
          <tbody>
            {cursosVisibles.map((curso) => (
              <tr key={curso.id} className="border-t">
                <td className="px-4 py-3">{curso.id}</td>
                <td className="px-4 py-3">{curso.nombre}</td>
                <td className="px-4 py-3">{curso.nivel}</td>
                <td className="px-4 py-3">{curso.modalidad}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6">
        <Paginacion
          loading={false}
          onPageChange={cambiarPagina}
          page={page}
          page_size={cantidadPorPagina}
          total={total}
          totalPages={totalPaginas}
        />
      </div>
    </main>
  );
}

export default ListaCursosPage;
