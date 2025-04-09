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
import { Clock } from "lucide-react";
import { useReservations } from "./useReservations";
import { LoadingState } from "./LoadingState";
import { ErrorState } from "./ErrorState";

const getStatusBadge = (status: string) => {
  switch (status) {
    case "activo":
      return <Badge className="bg-green-500">Activo</Badge>;
    case "devuelto":
      return (
        <Badge variant="outline" className="border-green-600 text-green-600">
          Devuelto
        </Badge>
      );
    case "vencido":
      return <Badge variant="destructive">Vencido</Badge>;
    case "pendiente":
      return <Badge variant="secondary">Pendiente</Badge>;
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
};

export function UserReservations({ userId }: { userId: string }) {
  const {
    data: reservations,
    isLoading,
    error,
    refetch,
  } = useReservations(userId);

  if (isLoading) {
    return (
      <LoadingState
        title="Historial de Reservaciones"
        description="Cargando reservaciones..."
        icon="book"
      />
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Historial de Reservaciones"
        description="No se pudieron cargar las reservaciones"
        icon="book"
        onRetry={refetch}
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Historial de Reservaciones
        </CardTitle>
        <CardDescription>
          Visualiza todas tus reservaciones de libros
        </CardDescription>
      </CardHeader>
      <CardContent>
        {reservations.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Libro</TableHead>
                  <TableHead>Fecha Reserva</TableHead>
                  <TableHead>Vencimiento</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell className="font-medium">
                      {reservation.codigoReferencia ?? "N/A"}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">
                          {reservation.libro.nombre}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {reservation.libro.autor}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {reservation.libro.codigo}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>{reservation.fechaReserva}</TableCell>
                    <TableCell>{reservation.fechaVencimiento}</TableCell>
                    <TableCell>{getStatusBadge(reservation.estado)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-medium">No hay reservaciones</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              No tienes reservaciones de libros actualmente.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
