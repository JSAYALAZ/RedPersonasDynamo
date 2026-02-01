"use client";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { buildQueryParams } from "../utils/QueryBuilder";
import { ApiResponse, isAxiosApiError } from "../types/api.types";

export default function useAxios<T = unknown>(url: string, qIn?: string) {





  const [data, setData] = useState<T>();
  const [error, setError] = useState<string>();
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setData(undefined);
    setLoading(true);
    try {
      const { data } = await axios.get<ApiResponse<T>>(
        `/api${url}`
      );
      if (data.success) {
        setData(data.data);
        setError(undefined);
        return data.data;
      }
    } catch (err) {
      if (isAxiosApiError(err)) {
        setError(err.response?.data.message);
      }
    } finally {
      setLoading(false);
    }
  }, [url]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, error, loading, refetch: fetchData, setData };
}
