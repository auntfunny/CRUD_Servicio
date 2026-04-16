import { useCallback, useEffect, useState } from "react";
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (config = {}) => {
      setLoading(true);
      setError(null);

      try {
        const finalMethod = (config.method || method).toUpperCase();
        const finalBody = config.hasOwnProperty("body") ? config.body : body;
        
        const { data } = await instance({
          method: finalMethod,
          url: config.url || url,
          data: finalBody !== null ? finalBody : undefined,
          params: config.params || params,
          headers: { ...headers, ...config.headers },
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
    [
      method,
      url,
      JSON.stringify(body),
      JSON.stringify(params),
      JSON.stringify(headers),
    ],
  );

  useEffect(() => {
    if (auto && method.toUpperCase() === "GET") {
      request();
    }
  }, [auto, method, request]);

  return { data, loading, error, request };
};

export default useAxios;
