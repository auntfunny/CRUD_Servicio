import usePaginacionApi from "../hooks/usePaginacionApi";
import Paginacion from "../components/Paginacion";

function UsuariosApiPage() {
  const {
    items,
    cargando,
    error,
    paginacionProps,
    page_size,
    cambiarCantidadPorPagina,
  } = usePaginacionApi("/users/", {
    paginaInicial: 1,
    cantidadInicial: 5,
  });

  const mensajeError =
    error?.response?.data?.detail?.[0]?.msg ??
    "No se pudo cargar la lista de usuarios.";

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="mb-4 text-2xl font-bold">Usuarios desde API</h1>

      <div className="mb-4 flex items-center gap-3">
        <label className="text-sm text-slate-700" htmlFor="cantidad-usuarios">
          Usuarios por pagina
        </label>
        <select
          id="cantidad-usuarios"
          className="rounded border px-3 py-2"
          onChange={(evento) => cambiarCantidadPorPagina(evento.target.value)}
          value={page_size}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
        </select>
      </div>

      {cargando ? <p>Cargando usuarios...</p> : null}

      {!cargando && error ? (
        <p className="mb-4 text-sm text-red-600">{mensajeError}</p>
      ) : null}

      {!cargando && !error ? (
        <div className="overflow-hidden rounded border">
          <table className="w-full border-collapse">
            <thead className="bg-slate-100 text-left">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Correo</th>
                <th className="px-4 py-3">Rol</th>
              </tr>
            </thead>
            <tbody>
              {items.map((usuario) => (
                <tr key={usuario.id} className="border-t">
                  <td className="px-4 py-3">{usuario.id}</td>
                  <td className="px-4 py-3">{usuario.full_name ?? "Sin nombre"}</td>
                  <td className="px-4 py-3">{usuario.email ?? "Sin correo"}</td>
                  <td className="px-4 py-3">{usuario.role ?? "Sin rol"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="mt-6">
        <Paginacion {...paginacionProps} />
      </div>
    </main>
  );
}

export default UsuariosApiPage;
