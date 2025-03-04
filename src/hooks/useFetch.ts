import { useState, useEffect, useRef, useCallback } from "react";
import axios, { AxiosRequestConfig, CancelTokenSource } from "axios";

const cache = new Map<string, any>(); // Global cache storage

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useFetch<T>(
  url: string,
  options: AxiosRequestConfig = {},
  dependencies: any[] = []
): UseFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const cancelToken = useRef<CancelTokenSource | null>(null);

  useEffect(() => {
    if (!url) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      // Check cache first
      if (cache.has(url)) {
        setData(cache.get(url));
        setLoading(false);
        return;
      }

      // Cancel previous request if a new one starts
      if (cancelToken.current) {
        cancelToken.current.cancel();
      }
      cancelToken.current = axios.CancelToken.source();

      try {
        const response = await axios.get<T>(url, {
          cancelToken: cancelToken.current.token,
          ...options,
        });

        cache.set(url, response.data); // Store in cache
        setData(response.data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError((err as Error).message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      if (cancelToken.current) {
        cancelToken.current.cancel();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, ...dependencies]);

  return { data, loading, error };
}

interface UsePostResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  postData: (body: any) => Promise<void>;
}

interface UsePostResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  postData: (body: any) => Promise<void>;
}

export function usePost<T>(
  url: string,
  options: AxiosRequestConfig = {}
): UsePostResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cancelToken = useRef<CancelTokenSource | null>(null);

  const postData = useCallback(
    async (body: any) => {
      console.log(body, url, "body");
      if (!url) return;
      console.log(url, "url");

      setLoading(true);
      setError(null);

      // Cancel previous request if a new one starts
      if (cancelToken.current) {
        cancelToken.current.cancel();
      }
      console.log(cancelToken.current, "cancel token");
      cancelToken.current = axios.CancelToken.source();
      console.log(cancelToken.current, "cancel token");
      try {
        const response = await axios.post<T>(url, body, {
          cancelToken: cancelToken.current.token,
          ...options,
        });
        console.log(response.data, "response data");

        setData(response.data);
      } catch (err) {
        if (!axios.isCancel(err)) {
          setError((err as Error).message);
        }
      } finally {
        setLoading(false);
      }
    },
    [url, options]
  );

  useEffect(() => {
    return () => {
      if (cancelToken.current) {
        cancelToken.current.cancel();
      }
    };
  }, []);

  return { data, loading, error, postData };
}
