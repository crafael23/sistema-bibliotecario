"use client";

import { Button } from "~/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

export function Pagination({
  currentPage,
  totalItems,
  pageSize,
  onPageChange,
  siblingCount = 1,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / pageSize);

  // Generate the range of page numbers to show
  function generatePaginationItems() {
    // Always show first page, last page, current page, and n siblings on each side
    const items: (number | "ellipsis")[] = [];

    // First page
    items.push(1);

    // Left ellipsis if needed
    if (currentPage - siblingCount > 2) {
      items.push("ellipsis");
    }

    // Generate siblings
    for (
      let i = Math.max(2, currentPage - siblingCount);
      i <= Math.min(totalPages - 1, currentPage + siblingCount);
      i++
    ) {
      items.push(i);
    }

    // Right ellipsis if needed
    if (currentPage + siblingCount < totalPages - 1) {
      items.push("ellipsis");
    }

    // Last page if not the same as first
    if (totalPages > 1) {
      items.push(totalPages);
    }

    return items;
  }

  const paginationItems = generatePaginationItems();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className="flex items-center justify-center gap-1 py-4">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        <ChevronsLeft className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      {paginationItems.map((item, index) =>
        item === "ellipsis" ? (
          <span key={`ellipsis-${index}`} className="px-3 py-2">
            ...
          </span>
        ) : (
          <Button
            key={`page-${item}`}
            variant={currentPage === item ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(item)}
          >
            {item}
          </Button>
        ),
      )}

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        <ChevronsRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
