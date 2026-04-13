import { useCallback, useEffect, useState } from "react";
import { instance } from "../api.js";

const useAxios = (url, {method = "GET", body = null, headers = {}, auto = true, params = {}} = {}) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const request = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const { data } = await instance({
                method: method,
                url: url,
                data: body,
                params: params,
                headers: headers,
            })

            setData(data);
        } catch (err) {
            setError(err);
            console.error("Algo salió mal: ", err);
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
