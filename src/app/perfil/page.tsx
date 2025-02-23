import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert"
import { AlertCircle } from "lucide-react"

// Esto normalmente vendría de tu base de datos
const reservasUsuario = [
  { id: 1, libro: "El Gran Gatsby", fechaInicio: "2023-06-01", fechaFin: "2023-06-15" },
  { id: 2, libro: "1984", fechaInicio: "2023-07-01", fechaFin: "2023-07-15" },
]

const multasUsuario = [
  { id: 1, libro: "Don Quijote", monto: 5.0, estado: "Pendiente" },
  { id: 2, libro: "Cien años de soledad", monto: 3.5, estado: "Pagada" },
]

export default function ProfilePage() {
  const multasPendientes = multasUsuario.filter((multa) => multa.estado === "Pendiente")
  const totalMultas = multasPendientes.reduce((total, multa) => total + multa.monto, 0)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Perfil de Usuario</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Juan Pérez</CardTitle>
          <CardDescription>juan.perez@ejemplo.com</CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Editar Perfil</Button>
        </CardContent>
      </Card>

      {totalMultas > 0 && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Multas Pendientes</AlertTitle>
          <AlertDescription>
            Tienes multas pendientes por un total de ${totalMultas.toFixed(2)}. Por favor, paga tus multas para
            continuar usando los servicios de la biblioteca.
          </AlertDescription>
        </Alert>
      )}

      <h2 className="text-xl font-semibold mb-2">Tus Reservas</h2>
      <Table className="mb-6">
        <TableHeader>
          <TableRow>
            <TableHead>Libro</TableHead>
            <TableHead>Fecha de Inicio</TableHead>
            <TableHead>Fecha de Fin</TableHead>
            <TableHead>Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reservasUsuario.map((reserva) => (
            <TableRow key={reserva.id}>
              <TableCell>{reserva.libro}</TableCell>
              <TableCell>{reserva.fechaInicio}</TableCell>
              <TableCell>{reserva.fechaFin}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Cancelar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <h2 className="text-xl font-semibold mb-2">Historial de Multas</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Libro</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acción</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {multasUsuario.map((multa) => (
            <TableRow key={multa.id}>
              <TableCell>{multa.libro}</TableCell>
              <TableCell>${multa.monto.toFixed(2)}</TableCell>
              <TableCell>{multa.estado}</TableCell>
              <TableCell>
                {multa.estado === "Pendiente" && (
                  <Button variant="outline" size="sm">
                    Pagar
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

