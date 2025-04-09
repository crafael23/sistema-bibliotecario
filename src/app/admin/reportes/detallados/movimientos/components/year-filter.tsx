"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Label } from "~/components/ui/label";

interface YearFilterProps {
  currentYear?: number;
}

export function YearFilter({ currentYear }: YearFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Get years from current to 5 years back
  const now = new Date();
  const thisYear = now.getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => thisYear - i);

  const handleYearChange = (year: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (year === "todos") {
      params.delete("anio");
    } else {
      params.set("anio", year);
    }

    params.set("page", "1"); // Reset to first page
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor="periodo">Periodo</Label>
      <Select
        defaultValue={currentYear ? currentYear.toString() : "todos"}
        onValueChange={handleYearChange}
      >
        <SelectTrigger id="periodo" className="w-[150px]">
          <SelectValue placeholder="Seleccionar periodo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          {years.map((year) => (
            <SelectItem key={year} value={year.toString()}>
              {year}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
