import { useCallback, useEffect, useMemo, useState } from "react";
import { instance } from "../api.js";

const useAxios = (url, options = {}) => {
  const {
    method = "GET",
    body = null,
    headers = {},
    auto = true,
    params = {},
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(
    method === "GET" && auto ? true : false,
  );
  const [error, setError] = useState(null);
  const bodyString = JSON.stringify(body);
  const paramsString = JSON.stringify(params);
  const headersString = JSON.stringify(headers);
  const memoizedBody = useMemo(() => body, [bodyString]);
  const memoizedParams = useMemo(() => params, [paramsString]);
  const memoizedHeaders = useMemo(() => headers, [headersString]);

  const request = useCallback(
    async (config = {}) => {
      setLoading(true);
      setError(null);

      try {
        const finalMethod = (config.method || method).toUpperCase();
        const finalBody = Object.prototype.hasOwnProperty.call(config, "body")
          ? config.body
          : memoizedBody;

        const { data } = await instance({
          method: finalMethod,
          url: config.url || url,
          data: finalBody !== null ? finalBody : undefined,
          params: config.params || memoizedParams,
          headers: { ...memoizedHeaders, ...config.headers },
        });

        setData(data);
        return data;
      } catch (err) {
        setError(err);
        console.error("Algo salió mal: ", err);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [method, url, bodyString, paramsString, headersString],
  );

  useEffect(() => {
    if (auto && method.toUpperCase() === "GET") {
      request();
    }
  }, [auto, method, request]);

  return { data, loading, error, request };
};

export default useAxios;
