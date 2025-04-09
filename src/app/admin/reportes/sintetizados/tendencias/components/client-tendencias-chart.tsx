"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "~/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

interface TendenciaDataPoint {
  dia: number;
  primerPeriodo: number;
  segundoPeriodo: number;
  crecimiento: number;
}

interface ClientTendenciasChartProps {
  data: TendenciaDataPoint[];
  primerPeriodoLabel: string;
  segundoPeriodoLabel: string;
  primerMes: number;
  primerAnio: number;
  segundoMes: number;
  segundoAnio: number;
}

type ViewMode = "daily" | "weekly";

export function ClientTendenciasChart({
  data,
  primerPeriodoLabel,
  segundoPeriodoLabel,
  primerMes,
  primerAnio,
  segundoMes,
  segundoAnio,
}: ClientTendenciasChartProps) {
  const router = useRouter();
  const currentYear = new Date().getFullYear();
  const [viewMode, setViewMode] = useState<ViewMode>("daily");

  // State to hold values before submitting
  const [localPrimerMes, setLocalPrimerMes] = useState(primerMes.toString());
  const [localPrimerAnio, setLocalPrimerAnio] = useState(primerAnio.toString());
  const [localSegundoMes, setLocalSegundoMes] = useState(segundoMes.toString());
  const [localSegundoAnio, setLocalSegundoAnio] = useState(
    segundoAnio.toString(),
  );

  // Custom colors for chart lines
  const chartColors = {
    primerPeriodo: "hsl(215, 100%, 50%)", // Vibrant blue
    segundoPeriodo: "hsl(340, 90%, 50%)", // Vibrant pink
  };

  // Generate years (current year down to 5 years back)
  const years = Array.from({ length: 6 }, (_, i) => {
    const year = currentYear - i;
    return { value: year.toString(), label: year.toString() };
  });

  // Generate months
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return {
      value: month.toString(),
      label: new Date(2000, i, 1).toLocaleDateString("es-ES", {
        month: "long",
      }),
    };
  });

  // Format chart data based on view mode
  const chartData = useMemo(() => {
    if (viewMode === "daily") {
      // Daily view - use data as is
      return data.map((item) => ({
        label: `Día ${item.dia}`,
        [primerPeriodoLabel]: item.primerPeriodo,
        [segundoPeriodoLabel]: item.segundoPeriodo,
      }));
    } else {
      // Weekly view - aggregate data into weeks
      const weeklyData = [];
      const weeksInMonth = Math.ceil(data.length / 7);

      for (let week = 0; week < weeksInMonth; week++) {
        const startDay = week * 7 + 1;
        const endDay = Math.min(startDay + 6, data.length);
        const weekLabel = `Semana ${week + 1}`;

        // Get data points for this week
        const weekDays = data.filter(
          (item) => item.dia >= startDay && item.dia <= endDay,
        );

        // Sum up values for the week
        const primerPeriodoSum = weekDays.reduce(
          (sum, day) => sum + day.primerPeriodo,
          0,
        );

        const segundoPeriodoSum = weekDays.reduce(
          (sum, day) => sum + day.segundoPeriodo,
          0,
        );

        weeklyData.push({
          label: weekLabel,
          [primerPeriodoLabel]: primerPeriodoSum,
          [segundoPeriodoLabel]: segundoPeriodoSum,
        });
      }

      return weeklyData;
    }
  }, [data, viewMode, primerPeriodoLabel, segundoPeriodoLabel]);

  // Update URL params when selections change
  const updateParams = () => {
    // Prevent selecting the same period
    if (
      localPrimerMes === localSegundoMes &&
      localPrimerAnio === localSegundoAnio
    ) {
      // If trying to select the same period, adjust the second period
      let newSegundoMes = parseInt(localSegundoMes) - 1;
      let newSegundoAnio = parseInt(localSegundoAnio);

      if (newSegundoMes === 0) {
        newSegundoMes = 12;
        newSegundoAnio -= 1;
      }

      setLocalSegundoMes(newSegundoMes.toString());
      setLocalSegundoAnio(newSegundoAnio.toString());

      const params = new URLSearchParams();
      params.set("primerMes", localPrimerMes);
      params.set("primerAnio", localPrimerAnio);
      params.set("segundoMes", newSegundoMes.toString());
      params.set("segundoAnio", newSegundoAnio.toString());

      router.push(`?${params.toString()}`);
      return;
    }

    const params = new URLSearchParams();
    params.set("primerMes", localPrimerMes);
    params.set("primerAnio", localPrimerAnio);
    params.set("segundoMes", localSegundoMes);
    params.set("segundoAnio", localSegundoAnio);

    router.push(`?${params.toString()}`);
  };

  // Update URL when selection changes after a short delay
  useEffect(() => {
    const timer = setTimeout(() => {
      updateParams();
    }, 300);

    return () => clearTimeout(timer);
  }, [localPrimerMes, localPrimerAnio, localSegundoMes, localSegundoAnio]);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <Tabs
          defaultValue="daily"
          value={viewMode}
          onValueChange={(value) => setViewMode(value as ViewMode)}
          className="w-auto"
        >
          <TabsList>
            <TabsTrigger value="daily">Diario</TabsTrigger>
            <TabsTrigger value="weekly">Semanal</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">
              Primer Período
            </span>
            <div className="flex items-center gap-2">
              <Select value={localPrimerMes} onValueChange={setLocalPrimerMes}>
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
              <Select
                value={localPrimerAnio}
                onValueChange={setLocalPrimerAnio}
              >
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
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-muted-foreground">
              Segundo Período
            </span>
            <div className="flex items-center gap-2">
              <Select
                value={localSegundoMes}
                onValueChange={setLocalSegundoMes}
              >
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
              <Select
                value={localSegundoAnio}
                onValueChange={setLocalSegundoAnio}
              >
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
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: chartColors.primerPeriodo }}
            />
            <span className="text-sm font-medium">{primerPeriodoLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: chartColors.segundoPeriodo }}
            />
            <span className="text-sm font-medium">{segundoPeriodoLabel}</span>
          </div>
        </div>

        <div className="h-[400px] w-full">
          <ChartContainer
            config={{
              [primerPeriodoLabel]: {
                label: primerPeriodoLabel,
                color: chartColors.primerPeriodo,
              },
              [segundoPeriodoLabel]: {
                label: segundoPeriodoLabel,
                color: chartColors.segundoPeriodo,
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="label" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line
                  type="monotone"
                  dataKey={primerPeriodoLabel}
                  stroke={chartColors.primerPeriodo}
                  strokeWidth={3}
                  dot={{ r: 4, fill: chartColors.primerPeriodo }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey={segundoPeriodoLabel}
                  stroke={chartColors.segundoPeriodo}
                  strokeWidth={3}
                  dot={{ r: 4, fill: chartColors.segundoPeriodo }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
