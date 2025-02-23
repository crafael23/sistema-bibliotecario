import { Button } from "~/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "~/components/ui/table"

// This would typically come from your database
const books = [
  { id: 1, title: "The Great Gatsby", author: "F. Scott Fitzgerald", status: "Available", copies: 3 },
  { id: 2, title: "To Kill a Mockingbird", author: "Harper Lee", status: "Reserved", copies: 2 },
  { id: 3, title: "1984", author: "George Orwell", status: "Borrowed", copies: 1 },
]

export default function InventoryPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Inventory Management</h1>
      <Button className="mb-4">Add New Book</Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Copies</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.map((book) => (
            <TableRow key={book.id}>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>{book.status}</TableCell>
              <TableCell>{book.copies}</TableCell>
              <TableCell>
                <Button variant="outline" size="sm" className="mr-2">
                  Edit
                </Button>
                <Button variant="outline" size="sm">
                  Update Status
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

