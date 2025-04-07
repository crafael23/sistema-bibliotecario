"use client";

import React from "react";

import { useState, useEffect, FormEvent } from "react";
import { PageHeader } from "~/components/page-header";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Book,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Search,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import { useRouter } from "next/navigation";

// Define the type for libro items from our database
type Libro = {
  id: number;
  codigo: string;
  nombre: string;
  categoria: string;
  autor: string;
  isbn: string;
  edicion: number;
  descripcion: string;
  editorial: string;
  urlImagenPortada: string;
  copias: number;
};

// Define the type for our paginated data
type PaginatedData = {
  libros: Libro[];
  nextCursor: number | null;
  hasNextPage: boolean;
  isSearchResult?: boolean;
  searchTerm?: string;
};

// Define the props for our component
type InventarioComponentProps = {
  initialData: PaginatedData;
  getLibrosAction: (params: {
    cursor?: number;
    pageSize?: number;
    orderBy?: "asc" | "desc";
  }) => Promise<PaginatedData>;
  searchLibrosAction: (params: {
    searchTerm: string;
  }) => Promise<PaginatedData>;
};

export default function InventarioComponent({
  initialData,
  getLibrosAction,
  searchLibrosAction,
}: InventarioComponentProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentData, setCurrentData] = useState<PaginatedData>(initialData);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [cursorHistory, setCursorHistory] = useState<(number | null)[]>([null]);
  const [orderBy, setOrderBy] = useState<"asc" | "desc">("asc");
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Handle search submission
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      return;
    }

    setLoading(true);
    try {
      const searchResults = await searchLibrosAction({
        searchTerm: query.trim(),
      });

      setCurrentData(searchResults);
      setIsSearchMode(true);
    } catch (error) {
      console.error("Error searching books:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle search form submission
  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    void handleSearch(searchQuery);
  };

  // Clear search and reset to paginated view
  const clearSearch = async () => {
    setSearchQuery("");
    setLoading(true);

    try {
      const data = await getLibrosAction({
        pageSize: itemsPerPage,
        orderBy,
      });

      setCurrentData(data);
      setIsSearchMode(false);
      setCurrentPage(1);
      setCursorHistory([null]);
    } catch (error) {
      console.error("Error clearing search:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle fetching data with the next cursor
  const fetchNextPage = async () => {
    if (!currentData.hasNextPage || isSearchMode) return;

    setLoading(true);
    try {
      // Get the next page data using the next cursor
      const nextData = await getLibrosAction({
        cursor: currentData.nextCursor ?? undefined,
        pageSize: itemsPerPage,
        orderBy,
      });

      setCurrentData(nextData);
      // Add the next cursor to history and increment page
      const nextPage = currentPage + 1;

      // If we're at the end of our current history, add the new cursor
      if (cursorHistory.length === nextPage) {
        setCursorHistory([...cursorHistory, nextData.nextCursor]);
      }

      setCurrentPage(nextPage);
    } catch (error) {
      console.error("Error fetching next page:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle going back to the previous page
  const fetchPreviousPage = async () => {
    if (currentPage <= 1 || isSearchMode) return;

    const prevPage = currentPage - 1;
    const prevCursor = cursorHistory[prevPage - 1]; // -1 because pages are 1-indexed, arrays are 0-indexed

    setLoading(true);
    try {
      // Get the previous page data using the stored cursor
      const prevData = await getLibrosAction({
        cursor: prevCursor ?? undefined,
        pageSize: itemsPerPage,
        orderBy,
      });

      setCurrentData(prevData);
      setCurrentPage(prevPage);
    } catch (error) {
      console.error("Error fetching previous page:", error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle the ordering between asc and desc
  const toggleOrdering = async () => {
    if (isSearchMode) return;

    const newOrder = orderBy === "asc" ? "desc" : "asc";
    setOrderBy(newOrder);
    setLoading(true);

    try {
      // Reset pagination when changing order
      const data = await getLibrosAction({
        pageSize: itemsPerPage,
        orderBy: newOrder,
      });

      setCurrentData(data);
      setCurrentPage(1);
      setCursorHistory([null]); // Reset cursor history when sort order changes
    } catch (error) {
      console.error("Error changing order:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle changing items per page
  const handleItemsPerPageChange = async (value: string) => {
    if (isSearchMode) return;

    const newItemsPerPage = Number(value);
    setItemsPerPage(newItemsPerPage);

    setLoading(true);
    try {
      // Reset pagination when changing items per page
      const data = await getLibrosAction({
        pageSize: newItemsPerPage,
        orderBy,
      });

      setCurrentData(data);
      setCurrentPage(1);
      setCursorHistory([null]); // Reset cursor history when page size changes
    } catch (error) {
      console.error("Error changing items per page:", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to navigate to libro details
  const navigateToLibroDetails = (libroId: number) => {
    router.push(`/admin/inventario/${libroId}`);
  };

  return (
    <>
      <PageHeader
        title="Inventario de Libros"
        icon={<Book className="h-6 w-6" />}
        showSearch={false}
        showAddButton={true}
      />
      <main className="w-full flex-1 overflow-auto px-4 pb-6 md:px-6">
        {/* Custom search form */}
        <div className="mb-4">
          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full max-w-lg items-center gap-2"
          >
            <Input
              type="text"
              placeholder="Buscar por título, autor o categoría..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={loading || !searchQuery.trim()}
              className="flex items-center gap-1"
            >
              <Search className="h-4 w-4" />
              <span>Buscar</span>
            </Button>
          </form>
        </div>

        {isSearchMode && currentData.searchTerm && (
          <div className="mb-4 flex items-center">
            <div className="flex items-center rounded-md bg-blue-50 px-3 py-1 text-blue-800">
              <span className="mr-2">
                Resultados para: &ldquo;{currentData.searchTerm}&rdquo;
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="h-6 w-6 rounded-full p-0"
              >
                ✕
              </Button>
            </div>
          </div>
        )}

        <div className="w-full rounded-md border bg-gray-100 shadow-md">
          {!isSearchMode && (
            <div className="flex items-center justify-between border-b p-2">
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleOrdering}
                  className="flex items-center space-x-1"
                >
                  <span>Ordenar</span>
                  <ArrowUpDown
                    className={`h-4 w-4 ${orderBy === "desc" ? "rotate-180 transform" : ""}`}
                  />
                  <span className="ml-1 text-xs">
                    ({orderBy === "asc" ? "A-Z" : "Z-A"})
                  </span>
                </Button>
              </div>
            </div>
          )}

          <div className="w-full overflow-x-auto">
            <Table className="w-full min-w-[800px]">
              <TableHeader className="bg-gray-200">
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Título</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Editorial</TableHead>
                  <TableHead>Copias</TableHead>
                  <TableHead>Acción</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center">
                      Cargando...
                    </TableCell>
                  </TableRow>
                ) : currentData.libros.length > 0 ? (
                  currentData.libros.map((libro) => (
                    <TableRow key={libro.id}>
                      <TableCell>{libro.id}</TableCell>
                      <TableCell>{libro.codigo}</TableCell>
                      <TableCell>{libro.nombre}</TableCell>
                      <TableCell>{libro.autor}</TableCell>
                      <TableCell>{libro.categoria}</TableCell>
                      <TableCell>{libro.editorial}</TableCell>
                      <TableCell>{libro.copias}</TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigateToLibroDetails(libro.id)}
                        >
                          Detalles
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center">
                      {isSearchMode
                        ? "No se encontraron libros que coincidan con tu búsqueda."
                        : "No hay libros disponibles."}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginación */}
          <div className="flex items-center justify-between border-t px-4 py-4">
            <div className="flex items-center space-x-2">
              <p className="text-sm text-gray-700">
                Mostrando{" "}
                <span className="font-medium">{currentData.libros.length}</span>{" "}
                libros{" "}
                {!isSearchMode &&
                  `${orderBy === "asc" ? "(A-Z)" : "(Z-A)"} - Página ${currentPage}`}
              </p>
            </div>

            {!isSearchMode && (
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <span className="text-sm">Filas por página:</span>
                  <Select
                    value={itemsPerPage.toString()}
                    onValueChange={handleItemsPerPageChange}
                  >
                    <SelectTrigger className="w-[70px]">
                      <SelectValue placeholder={itemsPerPage.toString()} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={fetchPreviousPage}
                    disabled={currentPage <= 1 || loading}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    size="icon"
                    onClick={fetchNextPage}
                    disabled={!currentData.hasNextPage || loading}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
