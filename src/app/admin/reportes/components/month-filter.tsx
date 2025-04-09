"use client";

import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Button } from "~/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface MonthFilterProps {
  onChange: (date: Date) => void;
  currentDate?: Date;
}

export function MonthFilter({ onChange, currentDate }: MonthFilterProps) {
  // Use current date as default unless override provided
  const now = currentDate ?? new Date();
  const [month, setMonth] = useState<string>((now.getMonth() + 1).toString());
  const [year, setYear] = useState<string>(now.getFullYear().toString());

  // Generate months & years for select options
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

  // Get years from current to 5 years back
  const currentYear = now.getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => ({
    value: (currentYear - i).toString(),
    label: (currentYear - i).toString(),
  }));

  const applyFilter = () => {
    const selectedDate = new Date(parseInt(year), parseInt(month) - 1, 1);
    onChange(selectedDate);
  };

  // On mount, trigger initial filter
  useEffect(() => {
    applyFilter();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div className="flex flex-wrap items-center gap-2">
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Mes" />
          </SelectTrigger>
          <SelectContent>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>
                {month.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Año" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year.value} value={year.value}>
                {year.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button type="button" size="sm" variant="outline" onClick={applyFilter}>
          <RefreshCcw className="mr-2 h-4 w-4" />
          Actualizar
        </Button>
      </div>
    </div>
  );
}
