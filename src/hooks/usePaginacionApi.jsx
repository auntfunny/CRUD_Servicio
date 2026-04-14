import { useCallback, useEffect, useMemo, useState } from "react";
import useAxios from "./useAxios";

function limpiarParametros(parametros = {}) {
  return Object.fromEntries(
    Object.entries(parametros).filter(([, valor]) => {
      return valor !== undefined && valor !== null && valor !== "";
    }),
  );
}

function usePaginacionApi(ruta, opciones = {}) {
  const {
    automatico = true,
    paginaInicial = 1,
    parametrosIniciales = {},
    cantidadInicial = 6,
  } = opciones;

  const [pagina, setPagina] = useState(paginaInicial);
  const [cantidadPorPagina, setCantidadPorPagina] = useState(cantidadInicial);
  const [parametros, setParametros] = useState(parametrosIniciales);
  const token = localStorage.getItem("token");

  const actualizarPagina = useCallback((nuevaPagina) => {
    if (nuevaPagina < 1) return;
    setPagina(nuevaPagina);
  }, []);

  const actualizarCantidad = useCallback((nuevaCantidad) => {
    setCantidadPorPagina(Number(nuevaCantidad));
  }, []);

  const mezclarParametros = useCallback((nuevosParametros = {}) => {
    setParametros((parametrosActuales) => ({
      ...parametrosActuales,
      ...nuevosParametros,
    }));
  }, []);

  const parametrosLimpios = useMemo(() => {
    return limpiarParametros({
      ...parametros,
      page: pagina,
      page_size: cantidadPorPagina,
    });
  }, [pagina, parametros, cantidadPorPagina]);

  const encabezados = useMemo(() => {
    if (!token) return {};

    return {
      Authorization: `Bearer ${token}`,
    };
  }, [token]);

  const {
    data,
    loading: cargando,
    error,
    request,
  } = useAxios(ruta, {
    auto: false,
    headers: encabezados,
    method: "GET",
    params: parametrosLimpios,
  });

  const items = useMemo(() => {
    return data?.items ?? [];
  }, [data]);

  const total = useMemo(() => {
    return data?.total ?? 0;
  }, [data]);

  const totalPaginas = useMemo(() => {
    return Math.max(1, Math.ceil(total / cantidadPorPagina));
  }, [cantidadPorPagina, total]);

  const obtenerDatos = useCallback(
    async (opcionesPeticion = {}) => {
      const { pagina: nuevaPagina, cantidadPorPagina: nuevaCantidad, parametros: nuevosParametros } = opcionesPeticion;

      if (nuevosParametros) {
        mezclarParametros(nuevosParametros);
      }

      if (nuevaPagina !== undefined) {
        actualizarPagina(nuevaPagina);
      }

      if (nuevaCantidad !== undefined) {
        actualizarCantidad(nuevaCantidad);
      }

      const hayCambiosDeEstado =
        nuevaPagina !== undefined ||
        nuevaCantidad !== undefined ||
        nuevosParametros !== undefined;

      if (!hayCambiosDeEstado) {
        await request();
      }
    },
    [actualizarCantidad, actualizarPagina, mezclarParametros, request],
  );

  useEffect(() => {
    if (!automatico) return;
    request();
  }, [automatico, request]);

  const cambiarPagina = (nuevaPagina) => {
    actualizarPagina(nuevaPagina);
  };

  const paginaSiguiente = () => {
    if (pagina < totalPaginas) {
      actualizarPagina(pagina + 1);
    }
  };

  const paginaAnterior = () => {
    if (pagina > 1) {
      actualizarPagina(pagina - 1);
    }
  };

  const cambiarCantidadPorPagina = (nuevaCantidad) => {
    actualizarPagina(1);
    actualizarCantidad(nuevaCantidad);
  };

  const actualizarParametros = (nuevosParametros = {}) => {
    actualizarPagina(1);
    mezclarParametros(nuevosParametros);
  };

  const resetearPaginacion = () => {
    setPagina(paginaInicial);
    setCantidadPorPagina(cantidadInicial);
    setParametros(parametrosIniciales);
  };

  const paginacionProps = {
    loading: cargando,
    onPageChange: cambiarPagina,
    page: pagina,
    page_size: cantidadPorPagina,
    total,
    totalPages: totalPaginas,
  };

  return {
    items,
    pagina,
    page: pagina,
    cantidadPorPagina,
    page_size: cantidadPorPagina,
    total,
    totalPaginas,
    cargando,
    error,
    parametros,
    paginacionProps,
    obtenerDatos,
    cambiarPagina,
    paginaSiguiente,
    paginaAnterior,
    cambiarCantidadPorPagina,
    actualizarParametros,
    resetearPaginacion,
  };
}

export default usePaginacionApi;
