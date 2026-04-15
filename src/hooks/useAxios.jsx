import { useCallback, useEffect, useMemo, useState } from "react";
import { instance } from "../api.js";

const objetovacio = {};

const useAxios = (
  url,
  {
    method = "GET",
    body = null,
    headers = objetovacio,
    auto = true,
    params = objetovacio,
  } = objetovacio,
) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const headersBase = useMemo(() => headers, [JSON.stringify(headers)]);
    const paramsBase = useMemo(() => params, [JSON.stringify(params)]);
    
    const request = useCallback(async (config = {}) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await instance({
                method: config?.method ?? method,
                url: config?.url ?? url,
                data: config?.body ?? body,
                params: config?.params ?? paramsBase,
                headers: config?.headers ?? headersBase,
            })

            setData(data);
            return data;
        } catch (err) {
            setError(err);
            console.error("Algo salió mal: ", err);
            throw err
        } finally {
            setLoading(false);
        }
    }, [body, headersBase, method, paramsBase, url])
    
    useEffect(() => {
        if(auto && method.toUpperCase() === "GET"){
            request().catch(() => {});
        }
    }, [auto, method, request]);
    
    
    return {data, loading, error, request};
}

export default useAxios;
