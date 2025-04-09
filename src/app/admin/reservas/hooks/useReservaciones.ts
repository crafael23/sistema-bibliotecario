import { useCallback, useState } from "react";
import type {
  ReservationPaginationParams,
  PaginatedReservaciones,
  ReservacionWithDetails,
} from "../types";
import { getReservacionesByStatus } from "../actions";

// Custom type extending PaginatedReservaciones to track search terms
interface ReservacionesState extends PaginatedReservaciones {
  searchTerm?: string;
}

/**
 * Custom hook to manage reservations data with pagination and search
 *
 * @param initialData - Initial data for the reservations
 * @param status - Status of reservations to fetch ("pendiente", "activo", "devuelto")
 * @returns Object with reservations data and functions to manage it
 */
export function useReservaciones(
  initialData: PaginatedReservaciones,
  status: "pendiente" | "activo" | "devuelto",
) {
  const [data, setData] = useState<ReservacionesState>({
    ...initialData,
    searchTerm: undefined,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  /**
   * Fetch reservations with pagination and search
   */
  const fetchReservaciones = useCallback(
    async (params: Partial<ReservationPaginationParams>) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await getReservacionesByStatus(status, {
          pageSize: 15,
          ...params,
        });

        setData({
          ...result,
          searchTerm: params.searchTerm,
        });

        return result;
      } catch (err) {
        const error =
          err instanceof Error
            ? err
            : new Error("Failed to fetch reservaciones");
        setError(error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [status],
  );

  /**
   * Fetch next page of reservations
   */
  const fetchNextPage = useCallback(async () => {
    if (!data.hasNextPage || isLoading) return;

    return fetchReservaciones({
      cursor: data.nextCursor ?? 0,
      searchTerm: data.searchTerm,
    });
  }, [data, fetchReservaciones, isLoading]);

  /**
   * Filter reservations by search term
   */
  const searchReservaciones = useCallback(
    (searchTerm: string) => {
      return fetchReservaciones({ searchTerm, cursor: 0 });
    },
    [fetchReservaciones],
  );

  /**
   * Refresh the current reservations
   */
  const refreshData = useCallback(() => {
    return fetchReservaciones({
      cursor:
        data.currentPage > 1
          ? (data.currentPage - 1) * (data.items.length ?? 15)
          : 0,
      searchTerm: data.searchTerm,
    });
  }, [data, fetchReservaciones]);

  /**
   * Update a reservation locally (optimistic update)
   */
  const updateReservationLocally = useCallback(
    (reservacionId: number, updatedValues: Partial<ReservacionWithDetails>) => {
      setData((prev) => ({
        ...prev,
        items: prev.items.map((item) =>
          item.id === reservacionId ? { ...item, ...updatedValues } : item,
        ),
      }));
    },
    [],
  );

  /**
   * Remove a reservation locally (optimistic update)
   */
  const removeReservationLocally = useCallback((reservacionId: number) => {
    setData((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== reservacionId),
      totalCount: prev.totalCount > 0 ? prev.totalCount - 1 : 0,
    }));
  }, []);

  return {
    data,
    isLoading,
    error,
    fetchReservaciones,
    fetchNextPage,
    searchReservaciones,
    refreshData,
    updateReservationLocally,
    removeReservationLocally,
  };
}
