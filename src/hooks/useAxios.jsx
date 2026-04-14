import { useCallback, useEffect, useState } from "react";
import { instance } from "../api.js";

const useAxios = (url, {method = "GET", body = null, headers = {}, auto = true, params = {}} = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const request = useCallback(async (config = {}) => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await instance({
                method: config?.method || method,
                url: config?.url || url,
                data: config?.body || body,
                params: config?.params || params,
                headers: config?.headers || headers,
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
    }, [method, url, body, params, headers])
    
    useEffect(() => {
        if(auto && method.toUpperCase() === "GET"){
            request();
        }
    }, [auto, method, request]);
    
    
    return {data, loading, error, request};
}

export default useAxios;
