"use client";
import { useState, useCallback, useEffect } from "react";
import { getUserFines } from "../../actions";
import type { Fine, DataFetchState } from "./types";

export const useFines = (userId: string) => {
  const [state, setState] = useState<DataFetchState<Fine>>({
    data: [],
    isLoading: true,
    error: null,
  });

  const fetchFines = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const data = await getUserFines(userId);

      setState((prev) => ({ ...prev, data }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err : new Error("Error desconocido"),
      }));
    } finally {
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [userId]);

  useEffect(() => {
    void fetchFines();
  }, [fetchFines]);

  const totalPendiente = state.data
    .filter((fine) => fine.estado === "pendiente")
    .reduce((sum, fine) => sum + parseFloat(fine.monto), 0);

  return {
    ...state,
    totalPendiente,
    refetch: fetchFines,
  };
};
