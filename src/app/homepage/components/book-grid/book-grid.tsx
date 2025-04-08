"use client";

import { useState, useEffect } from "react";
import { getLibrosPaginated } from "../../actions";
import BookCard from "./book-card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "~/components/ui/pagination";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { AlertCircle } from "lucide-react";

type BookGridProps = {
  initialData: Awaited<ReturnType<typeof getLibrosPaginated>>;
  category?: string;
  searchTerm?: string;
};

export default function BookGrid({
  initialData,
  category,
  searchTerm,
}: BookGridProps) {
  const [currentPage, setCurrentPage] = useState(initialData.currentPage);
  const [data, setData] = useState(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update data when category or search term changes
  useEffect(() => {
    console.log("[Client] Category or search term changed:", {
      category,
      searchTerm,
    });
    setCurrentPage(1);
    setData(initialData);
    setError(null);
  }, [category, searchTerm, initialData]);

  const handlePageChange = async (page: number) => {
    console.log("[Client] Page change requested:", page);
    setIsLoading(true);
    setError(null);
    try {
      const newData = await getLibrosPaginated({
        cursor: (page - 1) * 6,
        pageSize: 6,
        orderBy: "asc",
        category,
        searchTerm,
      });
      console.log("[Client] New data fetched:", newData);
      setData(newData);
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      console.error("[Client] Error fetching books:", err);
      setError("Error al cargar los libros. Por favor, intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderPageNumbers = () => {
    const totalPages = data.totalPages;
    const current = currentPage;
    const pages: (number | string)[] = [];

    // Always show first page
    pages.push(1);

    if (current > 3) {
      pages.push("...");
    }

    // Show pages around current page
    for (
      let i = Math.max(2, current - 1);
      i <= Math.min(totalPages - 1, current + 1);
      i++
    ) {
      pages.push(i);
    }

    if (current < totalPages - 2) {
      pages.push("...");
    }

    // Always show last page if there is more than one page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages.map((page, index) => {
      if (page === "...") {
        return (
          <PaginationItem key={`ellipsis-${index}`}>
            <span className="px-2">...</span>
          </PaginationItem>
        );
      }

      return (
        <PaginationItem key={page}>
          <PaginationLink
            onClick={() => typeof page === "number" && handlePageChange(page)}
            isActive={currentPage === page}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      );
    });
  };

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (data.items.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-muted-foreground">
          No se encontraron libros con los criterios seleccionados.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {data.items.map((book) => (
          <BookCard key={book.id} {...book} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination className="mt-8">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              onClick={() =>
                currentPage > 1 && handlePageChange(currentPage - 1)
              }
              className={
                currentPage === 1
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>

          {renderPageNumbers()}

          <PaginationItem>
            <PaginationNext
              onClick={() =>
                currentPage < data.totalPages &&
                handlePageChange(currentPage + 1)
              }
              className={
                currentPage >= data.totalPages
                  ? "pointer-events-none opacity-50"
                  : "cursor-pointer"
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
