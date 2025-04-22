"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

interface PeriodoSelectorProps {
  initialPrimerMes: number;
  initialPrimerAnio: number;
  initialSegundoMes: number;
  initialSegundoAnio: number;
}

const MESES = [
  { value: 1, label: "Enero" },
  { value: 2, label: "Febrero" },
  { value: 3, label: "Marzo" },
  { value: 4, label: "Abril" },
  { value: 5, label: "Mayo" },
  { value: 6, label: "Junio" },
  { value: 7, label: "Julio" },
  { value: 8, label: "Agosto" },
  { value: 9, label: "Septiembre" },
  { value: 10, label: "Octubre" },
  { value: 11, label: "Noviembre" },
  { value: 12, label: "Diciembre" },
];

const generateYearOptions = () => {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = currentYear; i >= currentYear - 10; i--) {
    years.push(i);
  }
  return years;
};

export function PeriodoSelector({
  initialPrimerMes,
  initialPrimerAnio,
  initialSegundoMes,
  initialSegundoAnio,
}: PeriodoSelectorProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [primerMes, setPrimerMes] = useState<number>(initialPrimerMes);
  const [primerAnio, setPrimerAnio] = useState<number>(initialPrimerAnio);
  const [segundoMes, setSegundoMes] = useState<number>(initialSegundoMes);
  const [segundoAnio, setSegundoAnio] = useState<number>(initialSegundoAnio);

  const yearOptions = generateYearOptions();

  const handleUpdateParams = () => {
    const params = new URLSearchParams();
    params.set("primerMes", primerMes.toString());
    params.set("primerAnio", primerAnio.toString());
    params.set("segundoMes", segundoMes.toString());
    params.set("segundoAnio", segundoAnio.toString());

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
      {/* Periodo 1 */}
      <div className="space-y-2 lg:col-span-2">
        <Label className="font-semibold">Primer Periodo (Reciente)</Label>
        <div className="flex gap-2">
          <Select
            value={primerMes.toString()}
            onValueChange={(value) => setPrimerMes(parseInt(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Mes" />
            </SelectTrigger>
            <SelectContent>
              {MESES.map((mes) => (
                <SelectItem key={mes.value} value={mes.value.toString()}>
                  {mes.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={primerAnio.toString()}
            onValueChange={(value) => setPrimerAnio(parseInt(value))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Año" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Periodo 2 */}
      <div className="space-y-2 lg:col-span-2">
        <Label className="font-semibold">Segundo Periodo (Anterior)</Label>
        <div className="flex gap-2">
          <Select
            value={segundoMes.toString()}
            onValueChange={(value) => setSegundoMes(parseInt(value))}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Mes" />
            </SelectTrigger>
            <SelectContent>
              {MESES.map((mes) => (
                <SelectItem key={mes.value} value={mes.value.toString()}>
                  {mes.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={segundoAnio.toString()}
            onValueChange={(value) => setSegundoAnio(parseInt(value))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Año" />
            </SelectTrigger>
            <SelectContent>
              {yearOptions.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Update Button */}
      <div className="flex items-end lg:col-span-1">
        <Button onClick={handleUpdateParams} className="w-full">
          Actualizar
        </Button>
      </div>
    </div>
  );
}
