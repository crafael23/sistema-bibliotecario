import { Button } from "~/components/ui/button";

interface ReportFooterProps {
  itemCount: number;
  totalItems: number;
  itemLabel: string;
  additionalInfo?: string;
}

export function ReportFooter({
  itemCount,
  totalItems,
  itemLabel,
  additionalInfo,
}: ReportFooterProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="text-sm text-muted-foreground">
        Mostrando {itemCount} de {totalItems} {itemLabel}
        {additionalInfo ? ` • ${additionalInfo}` : ""}
      </div>
      <div className="flex flex-wrap gap-2">
        <Button>Exportar a Excel</Button>
        <Button>Exportar a PDF</Button>
      </div>
    </div>
  );
}
