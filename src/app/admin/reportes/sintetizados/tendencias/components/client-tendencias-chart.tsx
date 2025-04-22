"use client";

import { useMemo, useState } from "react";
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
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";

// Interface for a single data point received from the server
interface TendenciaDataPoint {
  dia: number;
  primerPeriodo: number;
  segundoPeriodo: number;
  crecimiento: number; // Although received, it's not directly used in this chart component
}

// Props for the ClientTendenciasChart component
interface ClientTendenciasChartProps {
  data: TendenciaDataPoint[];
  primerPeriodoLabel: string;
  segundoPeriodoLabel: string;
  // Removed period numbers (primerMes, etc.) as selection is handled by parent
}

// Type for the view mode state
type ViewMode = "daily" | "weekly";

// Interface for the data structure formatted for the Recharts component
interface FormattedChartData {
  label: string; // x-axis label (e.g., 'Día 5' or 'Semana 2')
  [key: string]: number | string; // Allows dynamic keys based on period labels
}

export function ClientTendenciasChart({
  data,
  primerPeriodoLabel,
  segundoPeriodoLabel,
}: ClientTendenciasChartProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("daily");

  // Custom colors for chart lines
  const chartColors = {
    primerPeriodo: "hsl(var(--chart-1))", // Use CSS variables for theming
    segundoPeriodo: "hsl(var(--chart-2))",
  };

  // Memoized processing of data for the chart based on view mode
  const chartData = useMemo<FormattedChartData[]>(() => {
    if (!data || data.length === 0) return [];

    if (viewMode === "daily") {
      // Daily view: Use data as is, format label
      return data.map((item) => ({
        label: `Día ${item.dia}`,
        [primerPeriodoLabel]: item.primerPeriodo,
        [segundoPeriodoLabel]: item.segundoPeriodo,
      }));
    } else {
      // Weekly view: Aggregate data into weeks
      const weeklyDataMap = new Map<
        number,
        { primerSum: number; segundoSum: number }
      >();
      const daysInMonth =
        data.length > 0 ? Math.max(...data.map((d) => d.dia)) : 0;

      data.forEach((item) => {
        const weekNumber = Math.ceil(item.dia / 7);
        const currentWeek = weeklyDataMap.get(weekNumber) ?? {
          primerSum: 0,
          segundoSum: 0,
        };
        currentWeek.primerSum += item.primerPeriodo;
        currentWeek.segundoSum += item.segundoPeriodo;
        weeklyDataMap.set(weekNumber, currentWeek);
      });

      // Convert map to array format required by chart
      const weeklyData: FormattedChartData[] = [];
      weeklyDataMap.forEach((sums, weekNumber) => {
        weeklyData.push({
          label: `Semana ${weekNumber}`,
          [primerPeriodoLabel]: sums.primerSum,
          [segundoPeriodoLabel]: sums.segundoSum,
        });
      });

      // Ensure weeks are sorted correctly
      return weeklyData.sort((a, b) => {
        // Robustly parse week number, default to 0 if parsing fails
        const weekA = parseInt(a.label.split(" ")[1] ?? "0");
        const weekB = parseInt(b.label.split(" ")[1] ?? "0");
        return (isNaN(weekA) ? 0 : weekA) - (isNaN(weekB) ? 0 : weekB);
      });
    }
  }, [data, viewMode, primerPeriodoLabel, segundoPeriodoLabel]);

  // Define chart configuration for tooltip and legend
  const chartConfig = {
    [primerPeriodoLabel]: {
      label: primerPeriodoLabel,
      color: chartColors.primerPeriodo,
    },
    [segundoPeriodoLabel]: {
      label: segundoPeriodoLabel,
      color: chartColors.segundoPeriodo,
    },
  };

  return (
    // Use a div that allows the ResponsiveContainer to determine its size
    // Added min-height as a safeguard against collapse
    <div className="min-h-[400px] w-full">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        {/* View Mode Toggle */}
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

        {/* Chart Legend */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: chartColors.primerPeriodo }}
            />
            <span className="text-sm font-medium text-muted-foreground">
              {primerPeriodoLabel}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3 shrink-0 rounded-full"
              style={{ backgroundColor: chartColors.segundoPeriodo }}
            />
            <span className="text-sm font-medium text-muted-foreground">
              {segundoPeriodoLabel}
            </span>
          </div>
        </div>
      </div>

      {/* Chart Rendering Area */}
      {chartData.length === 0 ? (
        <div className="flex h-[350px] items-center justify-center rounded-lg border border-dashed">
          <p className="text-muted-foreground">
            No hay datos para mostrar en el gráfico.
          </p>
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 20, left: -10, bottom: 5 }} // Adjusted margins
              accessibilityLayer // Improve accessibility
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                // tickFormatter={(value) => value.slice(0, 3)} // Optional: Shorten labels if needed
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                width={40} // Adjust width for Y-axis labels
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    indicator="line"
                    nameKey={undefined}
                    labelKey={undefined}
                  />
                } // Use standard tooltip content
              />
              <Line
                dataKey={primerPeriodoLabel}
                type="monotone"
                stroke={chartColors.primerPeriodo}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
              <Line
                dataKey={segundoPeriodoLabel}
                type="monotone"
                stroke={chartColors.segundoPeriodo}
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      )}
    </div>
  );
}
