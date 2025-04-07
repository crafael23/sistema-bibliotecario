"use client";

import React from "react";
import { useState, useEffect, type FormEvent } from "react";
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
  Users,
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
import { Badge } from "~/components/ui/badge";

// Define the type for usuario items from our database
type Usuario = {
  clerkId: string;
  nombre: string;
  email: string;
  telefono: string | null;
  direccion: string | null;
  identidad: string | null;
  tipoDeUsuario: "externos" | "estudiantes" | "docentes" | "bibliotecarios";
  nuevo: boolean;
};

// Define the type for our paginated data
type PaginatedData = {
  usuarios: Usuario[];
  nextCursor: string | null;
  hasNextPage: boolean;
  isSearchResult?: boolean;
  searchTerm?: string;
};

// Define the props for our component
type UsuariosComponentProps = {
  initialData: PaginatedData;
  getUsuariosAction: (params: {
    cursor?: string;
    pageSize?: number;
    orderBy?: "asc" | "desc";
  }) => Promise<PaginatedData>;
  searchUsuariosAction: (params: {
    searchTerm: string;
  }) => Promise<PaginatedData>;
};

export default function UsuariosComponent({
  initialData,
  getUsuariosAction,
  searchUsuariosAction,
}: UsuariosComponentProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentData, setCurrentData] = useState<PaginatedData>(initialData);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [cursorHistory, setCursorHistory] = useState<(string | null)[]>([null]);
  const [orderBy, setOrderBy] = useState<"asc" | "desc">("asc");
  const [isSearchMode, setIsSearchMode] = useState(false);

  // Handle search submission
  const handleSearch = async (query: string) => {
    if (!query.trim()) {
      return;
    }

    setLoading(true);
    try {
      const searchResults = await searchUsuariosAction({
        searchTerm: query.trim(),
      });

      setCurrentData(searchResults);
      setIsSearchMode(true);
    } catch (error) {
      console.error("Error searching users:", error);
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
      const data = await getUsuariosAction({
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
      const nextData = await getUsuariosAction({
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
      const prevData = await getUsuariosAction({
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
      const data = await getUsuariosAction({
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
      const data = await getUsuariosAction({
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

  // Function to navigate to user details
  const navigateToUserDetails = (userId: string) => {
    router.push(`/admin/usuarios/${userId}`);
  };

  // Function to get a friendly display for user type
  const getUserTypeDisplay = (type: Usuario["tipoDeUsuario"]) => {
    const typeMap: Record<
      Usuario["tipoDeUsuario"],
      {
        label: string;
        variant: "default" | "secondary" | "outline" | "destructive";
      }
    > = {
      externos: { label: "Externo", variant: "default" },
      estudiantes: { label: "Estudiante", variant: "secondary" },
      docentes: { label: "Docente", variant: "outline" },
      bibliotecarios: { label: "Bibliotecario", variant: "destructive" },
    };

    return typeMap[type] || { label: type, variant: "default" };
  };

  // Format date for display (assuming we'd add a createdAt field later)
  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <PageHeader
        title="Gestión de Usuarios"
        icon={<Users className="h-6 w-6" />}
        showSearch={false}
      />
      <main className="w-full flex-1 overflow-auto px-4 pb-6 md:px-6">
        {/* Search Bar and Controls */}
        <div className="mb-6 flex w-full flex-col items-start justify-between gap-4 md:flex-row md:items-center">
          <form
            onSubmit={handleSearchSubmit}
            className="flex w-full items-center gap-2 md:w-auto"
          >
            <div className="relative flex-1 md:min-w-[300px]">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email o identidad..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={loading}>
              Buscar
            </Button>
            {isSearchMode && (
              <Button
                variant="outline"
                onClick={clearSearch}
                disabled={loading}
              >
                Limpiar
              </Button>
            )}
          </form>

          {!isSearchMode && (
            <div className="flex w-full items-center gap-2 md:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleOrdering}
                disabled={loading}
              >
                Nombre
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
              <Select
                value={String(itemsPerPage)}
                onValueChange={handleItemsPerPageChange}
                disabled={loading}
              >
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="5 por página" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5 por página</SelectItem>
                  <SelectItem value="10">10 por página</SelectItem>
                  <SelectItem value="20">20 por página</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Search results indicator */}
        {isSearchMode && currentData.searchTerm && (
          <div className="mb-4">
            <p className="text-sm text-muted-foreground">
              Resultados de búsqueda para: &quot;{currentData.searchTerm}&quot;
              ({currentData.usuarios.length} resultados)
            </p>
          </div>
        )}

        {/* Users Table */}
        <div className="w-full rounded-md border bg-gray-100 shadow-md">
          <div className="w-full overflow-x-auto">
            <Table className="w-full min-w-[800px]">
              <TableHeader className="bg-gray-200">
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Tipo de Usuario</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.usuarios.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center">
                      {isSearchMode
                        ? "No se encontraron usuarios que coincidan con la búsqueda."
                        : "No hay usuarios registrados en el sistema."}
                    </TableCell>
                  </TableRow>
                ) : (
                  currentData.usuarios.map((user) => (
                    <TableRow key={user.clerkId}>
                      <TableCell className="font-medium">
                        {user.nombre}
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            getUserTypeDisplay(user.tipoDeUsuario).variant
                          }
                        >
                          {getUserTypeDisplay(user.tipoDeUsuario).label}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.nuevo ? "outline" : "default"}>
                          {user.nuevo ? "Nuevo" : "Activo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigateToUserDetails(user.clerkId)}
                        >
                          Ver detalles
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Pagination Controls */}
        {!isSearchMode && (
          <div className="mt-4 flex items-center justify-between">
            <Button
              variant="outline"
              onClick={fetchPreviousPage}
              disabled={currentPage <= 1 || loading}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>
            <span className="text-sm">
              Página {currentPage}
              {!currentData.hasNextPage && " (última)"}
            </span>
            <Button
              variant="outline"
              onClick={fetchNextPage}
              disabled={!currentData.hasNextPage || loading}
            >
              Siguiente
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        )}
      </main>
    </>
  );
}
