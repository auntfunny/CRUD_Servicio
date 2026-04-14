import { useCallback, useEffect, useMemo, useState } from "react";
import { instance } from "../api";

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
    tamanoInicial = 6,
  } = opciones;

  const [items, setItems] = useState([]);
  const [pagina, setPagina] = useState(paginaInicial);
  const [tamanoPagina, setTamanoPagina] = useState(tamanoInicial);
  const [total, setTotal] = useState(0);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [parametros, setParametros] = useState(parametrosIniciales);

  const totalPaginas = useMemo(() => {
    return Math.max(1, Math.ceil(total / tamanoPagina));
  }, [tamanoPagina, total]);

  const obtenerDatos = useCallback(
    async (opcionesPeticion = {}) => {
      const paginaActual = opcionesPeticion.pagina ?? pagina;
      const tamanoActual = opcionesPeticion.tamanoPagina ?? tamanoPagina;
      const parametrosActuales = limpiarParametros({
        ...parametros,
        ...opcionesPeticion.parametros,
      });

      setCargando(true);
      setError(null);

      try {
        const respuesta = await instance.get(ruta, {
          params: {
            ...parametrosActuales,
            page: paginaActual,
            page_size: tamanoActual,
          },
        });

        const data = respuesta.data;

        setItems(data.items ?? []);
        setTotal(data.total ?? 0);
        setPagina(data.page ?? paginaActual);
        setTamanoPagina(data.page_size ?? tamanoActual);
      } catch (err) {
        setError(err);
      } finally {
        setCargando(false);
      }
    },
    [pagina, parametros, ruta, tamanoPagina],
  );

  useEffect(() => {
    if (!automatico) return;
    obtenerDatos();
  }, [automatico, obtenerDatos, pagina, tamanoPagina]);

  const cambiarPagina = (nuevaPagina) => {
    if (nuevaPagina < 1) return;
    setPagina(nuevaPagina);
  };

  const paginaSiguiente = () => {
    if (pagina < totalPaginas) {
      setPagina((valorActual) => valorActual + 1);
    }
  };

  const paginaAnterior = () => {
    if (pagina > 1) {
      setPagina((valorActual) => valorActual - 1);
    }
  };

  const cambiarTamanoPagina = (nuevoTamano) => {
    setPagina(1);
    setTamanoPagina(Number(nuevoTamano));
  };

  const actualizarParametros = (nuevosParametros = {}) => {
    setPagina(1);
    setParametros((parametrosActuales) => ({
      ...parametrosActuales,
      ...nuevosParametros,
    }));
  };

  const resetearPaginacion = () => {
    setPagina(paginaInicial);
    setTamanoPagina(tamanoInicial);
    setParametros(parametrosIniciales);
  };

  useEffect(() => {
    if (!automatico) return;
    obtenerDatos({ pagina: 1, parametros });
  }, [automatico, obtenerDatos, parametros]);

  return {
    items,
    pagina,
    tamanoPagina,
    total,
    totalPaginas,
    cargando,
    error,
    parametros,
    obtenerDatos,
    cambiarPagina,
    paginaSiguiente,
    paginaAnterior,
    cambiarTamanoPagina,
    actualizarParametros,
    resetearPaginacion,
  };
}

export default usePaginacionApi;
