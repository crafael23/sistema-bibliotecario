"use client";
import { useState, useCallback, useEffect } from "react";
import { getUserReservations } from "../../actions";
import type { Reservation, DataFetchState } from "./types";

export const useReservations = (userId: string) => {
  const [state, setState] = useState<DataFetchState<Reservation>>({
    data: [],
    isLoading: true,
    error: null,
  });

  const fetchReservations = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));
      const data = await getUserReservations(userId);
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
    void fetchReservations();
  }, [fetchReservations]);

  return {
    ...state,
    refetch: fetchReservations,
  };
};
