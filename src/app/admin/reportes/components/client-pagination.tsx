"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "./pagination";

interface ClientPaginationProps {
  currentPage: number;
  totalItems: number;
  pageSize: number;
}

export function ClientPagination({
  currentPage,
  totalItems,
  pageSize,
}: ClientPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <Pagination
      currentPage={currentPage}
      totalItems={totalItems}
      pageSize={pageSize}
      onPageChange={handlePageChange}
    />
  );
}
