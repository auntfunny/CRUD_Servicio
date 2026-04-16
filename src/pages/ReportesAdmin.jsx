import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Paginacion from "../components/Paginacion";
import ReporteCard from "../components/ReporteCard";
import ReporteDetalleModal from "../components/ReporteDetalleModal";
import ReporteRevisionModal from "../components/ReporteRevisionModal";
import useAxios from "../hooks/useAxios";
import { estadoOptions, getFechaOrdenable } from "../utils/reportes";

function ReportesAdmin() {
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [busquedaAplicada, setBusquedaAplicada] = useState("");
  const [ordenActual, setOrdenActual] = useState("fecha-desc");
  const [reporteSeleccionado, setReporteSeleccionado] = useState(null);
  const [reporteRevisando, setReporteRevisando] = useState(null);
  const [pageConsulta, setPageConsulta] = useState(1);
  const [reportesBusqueda, setReportesBusqueda] = useState([]);
  const [cargandoBusqueda, setCargandoBusqueda] = useState(false);
  const [errorBusqueda, setErrorBusqueda] = useState(null);

  const paramsConsulta = useMemo(() => {
    const params = {
      page: pageConsulta,
      page_size: pageSize,
    };

    if (estadoFiltro) {
      params.status = estadoFiltro;
    }

    if (categoriaFiltro) {
      params.category_id = categoriaFiltro;
    }

    if (busqueda.trim()) {
      params.search = busqueda.trim();
    }

    return params;
  }, [busqueda, categoriaFiltro, estadoFiltro, pageConsulta, pageSize]);

  const {
    data,
    error,
    loading,
    request: recargarReportes,
  } = useAxios("/reports/", {
    params: paramsConsulta,
  });
  const { request: consultarReportes } = useAxios("/reports/", {
    auto: false,
  });
  const {
    loading: guardandoRevision,
    request: actualizarReporte,
  } = useAxios("/reports/", {
    auto: false,
    method: "PATCH",
  });

  const { data: categoriasData } = useAxios("/categories/");

  const reportes = Array.isArray(data?.items)
    ? data.items
    : Array.isArray(data?.data)
      ? data.data
      : Array.isArray(data?.results)
        ? data.results
        : Array.isArray(data)
          ? data
          : [];
  const categorias = Array.isArray(categoriasData?.items)
    ? categoriasData.items
    : Array.isArray(categoriasData?.data)
      ? categoriasData.data
      : Array.isArray(categoriasData?.results)
        ? categoriasData.results
        : Array.isArray(categoriasData)
          ? categoriasData
          : [];
  const mensajeError =
    errorBusqueda?.response?.data?.detail?.[0]?.msg ??
    error?.response?.data?.detail?.[0]?.msg ??
    "No se pudieron cargar los reportes.";

  const textoBusqueda = busquedaAplicada.trim().toLowerCase();
  const reportesFuente = textoBusqueda ? reportesBusqueda : reportes;

  const reportesFiltrados = useMemo(() => {
    return reportesFuente.filter((reporte) => {
      if (!textoBusqueda) {
        return true;
      }

      const valoresBusqueda = [
        reporte.id,
        reporte.description,
        reporte.category?.name,
        reporte.student?.full_name,
      ]
        .filter(Boolean)
        .map((valor) => String(valor).toLowerCase());

      return valoresBusqueda.some((valor) => valor.includes(textoBusqueda));
    });
  }, [reportesFuente, textoBusqueda]);

  const total = busqueda.trim() ? reportesFiltrados.length : data?.total ?? reportes.length;
  const reportesVisibles = useMemo(() => {
    const lista = [...reportesFiltrados];

    return lista.sort((reporteA, reporteB) => {
      if (ordenActual === "estudiante-asc") {
        return (reporteA.student?.full_name ?? "").localeCompare(
          reporteB.student?.full_name ?? "",
        );
      }

      if (ordenActual === "horas-desc" || ordenActual === "horas-asc") {
        const diferenciaHoras =
          Number(reporteA.hours_spent ?? 0) - Number(reporteB.hours_spent ?? 0);
        return ordenActual === "horas-desc" ? -diferenciaHoras : diferenciaHoras;
      }

      const diferenciaFecha =
        getFechaOrdenable(reporteA.created_at) - getFechaOrdenable(reporteB.created_at);
      return ordenActual === "fecha-desc" ? -diferenciaFecha : diferenciaFecha;
    });
  }, [ordenActual, reportesFiltrados]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setBusquedaAplicada(busqueda);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [busqueda]);

  useEffect(() => {
    if (textoBusqueda) {
      setPageConsulta(1);
      return;
    }

    if (ordenActual !== "fecha-asc") {
      setPageConsulta(page);
      return;
    }

    const totalPaginas = Math.max(1, Math.ceil(total / pageSize));
    setPageConsulta(Math.max(1, totalPaginas - page + 1));
  }, [ordenActual, page, pageSize, textoBusqueda, total]);

  useEffect(() => {
    if (!textoBusqueda) {
      setReportesBusqueda([]);
      setCargandoBusqueda(false);
      setErrorBusqueda(null);
      return;
    }

    let cancelado = false;

    const cargarReportesBusqueda = async () => {
      setCargandoBusqueda(true);
      setErrorBusqueda(null);

      try {
        let paginaActual = 1;
        let totalPaginas = 1;
        const acumulados = [];

        while (paginaActual <= totalPaginas) {
          const respuesta = await consultarReportes({
            params: {
              page: paginaActual,
              page_size: pageSize,
              ...(estadoFiltro ? { status: estadoFiltro } : {}),
              ...(categoriaFiltro ? { category_id: categoriaFiltro } : {}),
            },
          });

          const itemsPagina = Array.isArray(respuesta?.items)
            ? respuesta.items
            : Array.isArray(respuesta?.data)
              ? respuesta.data
              : Array.isArray(respuesta?.results)
                ? respuesta.results
                : Array.isArray(respuesta)
                  ? respuesta
                  : [];

          acumulados.push(...itemsPagina);

          const totalItems = Number(respuesta?.total ?? acumulados.length);
          totalPaginas = Math.max(1, Math.ceil(totalItems / pageSize));
          paginaActual += 1;
        }

        if (!cancelado) {
          setReportesBusqueda(acumulados);
        }
      } catch (err) {
        if (!cancelado) {
          setErrorBusqueda(err);
          setReportesBusqueda([]);
        }
      } finally {
        if (!cancelado) {
          setCargandoBusqueda(false);
        }
      }
    };

    cargarReportesBusqueda();

    return () => {
      cancelado = true;
    };
  }, [categoriaFiltro, consultarReportes, estadoFiltro, pageSize, textoBusqueda]);

  const resetearPaginacion = () => {
    setPage(1);
    setPageConsulta(1);
  };

  const cambiarBusqueda = (evento) => {
    setBusqueda(evento.target.value);
    resetearPaginacion();
  };

  const cambiarEstado = (evento) => {
    setEstadoFiltro(evento.target.value);
    resetearPaginacion();
  };

  const cambiarCategoria = (evento) => {
    setCategoriaFiltro(evento.target.value);
    resetearPaginacion();
  };

  const cambiarOrden = (evento) => {
    setOrdenActual(evento.target.value);
    resetearPaginacion();
  };

  const abrirDetalle = (reporte) => {
    setReporteSeleccionado(reporte);
  };

  const cerrarDetalle = () => {
    setReporteSeleccionado(null);
  };

  const abrirRevision = () => {
    if (!reporteSeleccionado) return;

    setReporteRevisando(reporteSeleccionado);
    cerrarDetalle();
  };

  const cerrarRevision = () => {
    setReporteRevisando(null);
  };

  const guardarRevision = async (payload) => {
    if (!reporteRevisando) return;

    await actualizarReporte({
      url: `/reports/${reporteRevisando.id}/review`,
      body: payload,
      method: "PATCH",
    });

    cerrarRevision();
    await recargarReportes({
      params: paramsConsulta,
    });
  };

  return (
    <main className="mx-auto max-w-7xl p-6">
      <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Reportes del admin</h1>
            <p className="mt-2 text-sm text-slate-500">
              Revisa, filtra y ordena los reportes desde la vista administrativa.
            </p>
          </div>

          <Link
            className="rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
            to="/estudiantes-pendientes"
          >
            Ver estudiantes pendientes
          </Link>
        </div>
      </section>

      <section className="mb-6 grid gap-4 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:grid-cols-2 xl:grid-cols-4">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Buscar
          <input
            className="rounded-2xl border border-slate-300 px-4 py-3"
            onChange={cambiarBusqueda}
            placeholder="Estudiante o categoria"
            type="text"
            value={busqueda}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Estado
          <select
            className="rounded-2xl border border-slate-300 px-4 py-3"
            onChange={cambiarEstado}
            value={estadoFiltro}
          >
            {estadoOptions.map((estado) => (
              <option key={estado.value} value={estado.value}>
                {estado.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Categoria
          <select
            className="rounded-2xl border border-slate-300 px-4 py-3"
            onChange={cambiarCategoria}
            value={categoriaFiltro}
          >
            <option value="">Todas</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={String(categoria.id)}>
                {categoria.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          Ordenar por
          <select
            className="rounded-2xl border border-slate-300 px-4 py-3"
            onChange={cambiarOrden}
            value={ordenActual}
          >
            <option value="fecha-desc">Mas recientes</option>
            <option value="fecha-asc">Mas antiguos</option>
            <option value="horas-desc">Mas horas</option>
            <option value="horas-asc">Menos horas</option>
            <option value="estudiante-asc">Estudiante A-Z</option>
          </select>
        </label>
      </section>

      {loading || cargandoBusqueda ? <p>Cargando reportes...</p> : null}
      {!loading && !cargandoBusqueda && (error || errorBusqueda) ? (
        <p className="text-red-600">{mensajeError}</p>
      ) : null}

      {!loading && !cargandoBusqueda && !error && !errorBusqueda ? (
        <>
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {reportesVisibles.map((reporte) => (
              <ReporteCard
                key={reporte.id}
                onClick={() => abrirDetalle(reporte)}
                reporte={reporte}
                showStudent
              />
            ))}
          </section>

          <div className="mt-6">
            <Paginacion
              onPageChange={setPage}
              page={page}
              page_size={pageSize}
              total={total}
            />
          </div>
        </>
      ) : null}

      {reporteSeleccionado ? (
        <ReporteDetalleModal
          canReview
          onClose={cerrarDetalle}
          onReview={abrirRevision}
          reporte={reporteSeleccionado}
        />
      ) : null}

      {reporteRevisando ? (
        <ReporteRevisionModal
          loading={guardandoRevision}
          onClose={cerrarRevision}
          onSubmit={guardarRevision}
          reporte={reporteRevisando}
        />
      ) : null}
    </main>
  );
}

export default ReportesAdmin;
