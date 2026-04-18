import { useCallback, useEffect, useMemo, useState } from "react";
import { instance } from "../api.js";

const responseCache = new Map();
const pendingRequests = new Map();

function buildCacheKey(url, params = {}, headers = {}) {
  return JSON.stringify({ headers, params, url });
}

const useAxios = (url, options = {}) => {
  const {
    method = "GET",
    body = null,
    headers = {},
    auto = true,
    params = {},
    staleTime = 30000,
    keepPreviousData = true,
  } = options;

  const normalizedMethod = method.toUpperCase();
  const bodyString = JSON.stringify(body);
  const paramsString = JSON.stringify(params);
  const headersString = JSON.stringify(headers);
  const memoizedBody = useMemo(() => body, [bodyString]);
  const memoizedParams = useMemo(() => params, [paramsString]);
  const memoizedHeaders = useMemo(() => headers, [headersString]);
  const baseCacheKey = useMemo(
    () => buildCacheKey(url, memoizedParams, memoizedHeaders),
    [url, paramsString, headersString],
  );

  const cachedEntry = normalizedMethod === "GET"
    ? responseCache.get(baseCacheKey)
    : null;
  const cacheIsFresh = Boolean(
    cachedEntry && Date.now() - cachedEntry.timestamp < staleTime,
  );

  const [data, setData] = useState(
    cacheIsFresh || keepPreviousData ? (cachedEntry?.data ?? null) : null,
  );
  const [loading, setLoading] = useState(
    normalizedMethod === "GET" && auto && !cacheIsFresh && !cachedEntry,
  );
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (config = {}) => {
      const finalMethod = (config.method || normalizedMethod).toUpperCase();
      const finalUrl = config.url || url;
      const finalBody = Object.prototype.hasOwnProperty.call(config, "body")
        ? config.body
        : memoizedBody;
      const finalParams = Object.prototype.hasOwnProperty.call(config, "params")
        ? config.params
        : memoizedParams;
      const finalHeaders = { ...memoizedHeaders, ...config.headers };
      const finalStaleTime = config.staleTime ?? staleTime;
      const finalKeepPreviousData = config.keepPreviousData ?? keepPreviousData;
      const finalPreferCache = config.preferCache ?? true;
      const cacheKey = buildCacheKey(finalUrl, finalParams, finalHeaders);
      const cachedResponse = finalMethod === "GET"
        ? responseCache.get(cacheKey)
        : null;
      const hasFreshCache = Boolean(
        cachedResponse &&
          Date.now() - cachedResponse.timestamp < finalStaleTime,
      );

      if (finalMethod === "GET" && finalPreferCache && hasFreshCache) {
        setData(cachedResponse.data);
        setLoading(false);
        return cachedResponse.data;
      }

      const shouldKeepContentVisible =
        finalKeepPreviousData && (data !== null || cachedResponse?.data !== undefined);

      if (shouldKeepContentVisible) {
        if (cachedResponse?.data !== undefined) {
          setData(cachedResponse.data);
        }
        setIsRefreshing(true);
        setLoading(false);
      } else {
        setLoading(true);
      }

      setError(null);

      const pendingKey = finalMethod === "GET" ? cacheKey : null;
      if (pendingKey && pendingRequests.has(pendingKey)) {
        try {
          const pendingData = await pendingRequests.get(pendingKey);
          setData(pendingData);
          return pendingData;
        } catch (err) {
          setError(err);
          throw err;
        } finally {
          setLoading(false);
          setIsRefreshing(false);
        }
      }

      const executeRequest = instance({
        method: finalMethod,
        url: finalUrl,
        data: finalBody !== null ? finalBody : undefined,
        params: finalParams,
        headers: finalHeaders,
      }).then((response) => response.data);

      if (pendingKey) {
        pendingRequests.set(pendingKey, executeRequest);
      }

      try {
        const responseData = await executeRequest;

        if (finalMethod === "GET") {
          responseCache.set(cacheKey, {
            data: responseData,
            timestamp: Date.now(),
          });
          setData(responseData);
        } else {
          responseCache.clear();
          setData(responseData);
        }

        return responseData;
      } catch (err) {
        setError(err);
        console.error("Algo salió mal:", err);
        throw err;
      } finally {
        if (pendingKey) {
          pendingRequests.delete(pendingKey);
        }
        setLoading(false);
        setIsRefreshing(false);
      }
    },
    [
      normalizedMethod,
      url,
      memoizedBody,
      memoizedHeaders,
      memoizedParams,
      staleTime,
      keepPreviousData,
      data,
    ],
  );

  useEffect(() => {
    if (!auto || normalizedMethod !== "GET") return undefined;

    if (cachedEntry?.data !== undefined) {
      setData(cachedEntry.data);
    }

    if (cacheIsFresh) {
      setLoading(false);
      return undefined;
    }

    request({
      keepPreviousData: keepPreviousData && Boolean(cachedEntry?.data),
      preferCache: false,
    }).catch(() => {});

    return undefined;
  }, [
    auto,
    normalizedMethod,
    request,
    keepPreviousData,
    cacheIsFresh,
    cachedEntry,
  ]);

  return { data, loading, isRefreshing, error, request };
};

export default useAxios;
