"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { CreditCard } from "lucide-react";
import { useFines } from "./useFines";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";
import type { Fine } from "./types";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "pagado":
      return <Badge className="bg-green-500">Pagado</Badge>;
    case "pendiente":
      return <Badge variant="destructive">Pendiente</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export function UserFines({ userId }: { userId: string }) {
  const {
    data: fines,
    isLoading,
    error,
    totalPendiente,
    refetch,
  } = useFines(userId);

  if (isLoading) {
    return (
      <LoadingState
        title="Notificaciones de Multas"
        description="Cargando multas..."
        icon="credit-card"
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Notificaciones de Multas"
        description="No se pudieron cargar las multas"
        icon="credit-card"
        onRetry={refetch}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Notificaciones de Multas
            </CardTitle>
            <CardDescription>
              Visualiza todas tus multas por retrasos en devoluciones
            </CardDescription>
          </div>
          {totalPendiente > 0 && (
            <div className="flex items-center gap-2 rounded-md bg-destructive/10 px-4 py-2 text-destructive">
              <CreditCard className="h-5 w-5" />
              <div>
                <p className="text-sm font-medium">Total pendiente</p>
                <p className="text-lg font-bold">L. {totalPendiente}</p>
              </div>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {fines.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Libro</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fines.map((fine) => (
                  <TableRow key={fine.id}>
                    <TableCell className="font-medium">{fine.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{fine.libroNombre}</p>
                        <p className="text-xs text-muted-foreground">
                          {fine.libroCodigo}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      L. {fine.monto}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {fine.categoriaMulta ?? "N/A"}
                      </Badge>
                    </TableCell>
                    <TableCell>{getStatusBadge(fine.estado)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CreditCard className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-medium">No hay multas</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              No tienes multas pendientes actualmente.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
