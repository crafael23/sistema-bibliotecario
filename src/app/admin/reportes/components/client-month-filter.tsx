"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { MonthFilter } from "./month-filter";

interface ClientMonthFilterProps {
  currentDate?: Date;
}

export function ClientMonthFilter({ currentDate }: ClientMonthFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleMonthChange = (date: Date) => {
    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    const params = new URLSearchParams(searchParams.toString());
    params.set("mes", month.toString());
    params.set("anio", year.toString());
    params.set("page", "1"); // Reset to first page on filter change

    router.push(`?${params.toString()}`);
  };

  return <MonthFilter onChange={handleMonthChange} currentDate={currentDate} />;
}
