import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";

// This would typically come from your database
const books = [
  {
    id: 1,
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    available: true,
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    available: false,
  },
  { id: 3, title: "1984", author: "George Orwell", available: true },
];

export default function ReservePage() {
  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Book Reservation</h1>
      <div className="mb-4">
        <Label htmlFor="search">Search Books</Label>
        <Input
          id="search"
          placeholder="Enter book title or author"
          className="max-w-sm"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Availability</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {books.map((book) => (
            <TableRow key={book.id}>
              <TableCell>{book.title}</TableCell>
              <TableCell>{book.author}</TableCell>
              <TableCell>
                {book.available ? "Available" : "Not Available"}
              </TableCell>
              <TableCell>
                <Button disabled={!book.available}>
                  {book.available ? "Reserve" : "Join Waitlist"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
