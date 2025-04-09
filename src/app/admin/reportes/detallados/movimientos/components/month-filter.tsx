"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import { Button } from "~/components/ui/button";
import { CalendarIcon, RefreshCw } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

interface MonthFilterProps {
  currentMonth?: number;
  currentYear?: number;
}

export function MonthFilter({ currentMonth, currentYear }: MonthFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Initialize state from props or default to 'all'
  const [month, setMonth] = useState<string>(currentMonth?.toString() ?? "all");
  const [year, setYear] = useState<string>(currentYear?.toString() ?? "all");

  // Memoize date-related values to avoid unnecessary recalculations
  const { years, months, currentDate } = useMemo(() => {
    // Get current date
    const now = new Date();
    const currentDate = new Date(now.getFullYear(), now.getMonth(), 1);

    // Generate years (current + 5 years back)
    const thisYear = now.getFullYear();
    const years = Array.from({ length: 6 }, (_, i) => thisYear - i);

    // Define months
    const months = [
      { value: "1", label: "Enero" },
      { value: "2", label: "Febrero" },
      { value: "3", label: "Marzo" },
      { value: "4", label: "Abril" },
      { value: "5", label: "Mayo" },
      { value: "6", label: "Junio" },
      { value: "7", label: "Julio" },
      { value: "8", label: "Agosto" },
      { value: "9", label: "Septiembre" },
      { value: "10", label: "Octubre" },
      { value: "11", label: "Noviembre" },
      { value: "12", label: "Diciembre" },
    ];

    return { years, months, currentDate };
  }, []);

  // Handle filter updates
  const handleFilter = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());

    // Update month parameter
    if (month !== "all") {
      params.set("mes", month);
    } else {
      params.delete("mes");
    }

    // Update year parameter
    if (year !== "all") {
      params.set("anio", year);
    } else {
      params.delete("anio");
    }

    // Reset to first page and navigate
    params.set("page", "1");
    router.push(`?${params.toString()}`, { scroll: false });
  }, [month, year, searchParams, router]);

  // Handle filter reset
  const handleReset = useCallback(() => {
    setMonth("all");
    setYear("all");

    const params = new URLSearchParams(searchParams.toString());
    params.delete("mes");
    params.delete("anio");
    params.set("page", "1");

    router.push(`?${params.toString()}`, { scroll: false });
  }, [searchParams, router]);

  // Format date for display
  const getFilterDisplay = () => {
    if (month !== "all" && year !== "all") {
      const monthLabel = months.find((m) => m.value === month)?.label ?? "";
      return `${monthLabel} ${year}`;
    } else if (year !== "all") {
      return `Todo el año ${year}`;
    }
    return "Sin filtro de fecha";
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <CalendarIcon className="h-4 w-4" /> Filtrar por fecha
        </CardTitle>
        {month !== "all" || year !== "all" ? (
          <CardDescription>{getFilterDisplay()}</CardDescription>
        ) : null}
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-col gap-1">
            <Label htmlFor="month">Mes</Label>
            <Select value={month} onValueChange={setMonth}>
              <SelectTrigger id="month" className="w-32">
                <SelectValue placeholder="Seleccionar mes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {months.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="year">Año</Label>
            <Select value={year} onValueChange={setYear}>
              <SelectTrigger id="year" className="w-28">
                <SelectValue placeholder="Seleccionar año" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {years.map((y) => (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="ml-auto flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={month === "all" && year === "all"}
            >
              <RefreshCw className="mr-2 h-3 w-3" />
              Limpiar
            </Button>
            <Button
              size="sm"
              onClick={handleFilter}
              disabled={
                month === currentMonth?.toString() &&
                year === currentYear?.toString()
              }
            >
              Aplicar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
