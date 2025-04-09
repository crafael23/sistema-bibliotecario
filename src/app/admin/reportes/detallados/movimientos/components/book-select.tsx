"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, ChevronsUpDown } from "lucide-react";
import type { BookSummary } from "~/app/admin/reportes/types/index";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

interface BookSelectProps {
  initialBookId?: number;
  allBooks: BookSummary[];
}

export function BookSelect({ initialBookId, allBooks }: BookSelectProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");

  // Find the initially selected book if any
  const initialBook = initialBookId
    ? allBooks.find((book) => book.id === initialBookId)
    : undefined;

  // Set initial value to the book's ID string if found, empty string otherwise
  const [value, setValue] = React.useState(initialBook?.id.toString() ?? "");

  // Filter books based on search term
  const filteredBooks = React.useMemo(() => {
    if (!searchTerm) return allBooks;

    const lowerSearch = searchTerm.toLowerCase();
    return allBooks.filter(
      (book) =>
        book.nombre?.toLowerCase().includes(lowerSearch) ||
        book.codigo?.toLowerCase().includes(lowerSearch) ||
        book.isbn?.toLowerCase().includes(lowerSearch),
    );
  }, [allBooks, searchTerm]);

  // Get book name from ID
  const getBookName = (bookId: string) => {
    const book = allBooks.find((b) => b.id.toString() === bookId);
    return book ? `${book.nombre} (${book.codigo})` : "Seleccionar libro...";
  };

  const handleSelect = (currentValue: string) => {
    // Deselect if clicking on the same item
    const newValue = currentValue === value ? "" : currentValue;
    setValue(newValue);
    setOpen(false);

    // Update URL params
    const params = new URLSearchParams(searchParams.toString());
    if (newValue) {
      params.set("libroId", newValue);
    } else {
      params.delete("libroId");
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[300px] justify-between"
          >
            {getBookName(value)}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command
            filter={(value, search) => {
              // Return 1 for all items as we're handling the filtering ourselves
              return 1;
            }}
          >
            <CommandInput
              placeholder="Buscar por nombre, código o ISBN..."
              value={searchTerm}
              onValueChange={setSearchTerm}
            />
            <CommandList className="max-h-[300px]">
              <CommandEmpty>No se encontraron libros.</CommandEmpty>
              <CommandGroup>
                {filteredBooks.map((book) => (
                  <CommandItem
                    key={book.id}
                    value={book.id.toString()}
                    onSelect={handleSelect}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === book.id.toString()
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    <div className="flex flex-col">
                      <span className="font-medium">{book.nombre}</span>
                      <span className="text-sm text-muted-foreground">
                        Código: {book.codigo} | ISBN: {book.isbn}
                      </span>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {value && (
        <Button variant="outline" size="sm" onClick={() => handleSelect("")}>
          Limpiar
        </Button>
      )}
    </div>
  );
}
