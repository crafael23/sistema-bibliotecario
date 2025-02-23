import { Button } from "~/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"

// This would typically come from your database
const userReservations = [
  { id: 1, book: "The Great Gatsby", startDate: "2023-06-01", endDate: "2023-06-15" },
  { id: 2, book: "1984", startDate: "2023-07-01", endDate: "2023-07-15" },
]

export default function ProfilePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">User Profile</h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>John Doe</CardTitle>
          <CardDescription>john.doe@example.com</CardDescription>
        </CardHeader>
        <CardContent>
          <Button>Edit Profile</Button>
        </CardContent>
      </Card>
      <h2 className="text-xl font-semibold mb-2">Your Reservations</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Book</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {userReservations.map((reservation) => (
            <TableRow key={reservation.id}>
              <TableCell>{reservation.book}</TableCell>
              <TableCell>{reservation.startDate}</TableCell>
              <TableCell>{reservation.endDate}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Cancel
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

