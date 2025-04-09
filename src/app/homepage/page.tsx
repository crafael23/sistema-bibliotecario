import { Suspense } from "react";
import { getLibrosPaginated } from "./actions";
import BookGrid from "./components/book-grid/book-grid";
import SearchControls from "./components/search-controls";
import { ErrorBoundary } from "~/components/error-boundary";
import { LoadingSpinner } from "~/components/ui/loading-spinner";
import { Button } from "~/components/ui/button";
import { User } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // Revalidate every hour

type SearchParams = {
  category?: string;
  search?: string;
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { category, search: searchTerm } = params;

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="text-center">
            <h1 className="mb-2 text-3xl font-bold">
              Biblioteca Casa de la Cultura
            </h1>
            <p className="text-muted-foreground">
              Explora nuestra colección de libros y encuentra tu próxima lectura
            </p>
          </div>
          <Button variant="outline" size="icon" asChild>
            <Link href="/homepage/perfil">
              <User className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        <ErrorBoundary fallback={<div>Error loading search controls</div>}>
          <SearchControls />
        </ErrorBoundary>
      </header>

      <main className="mt-8">
        <ErrorBoundary fallback={<div>Error loading books</div>}>
          <Suspense fallback={<LoadingSpinner />}>
            <BookGridContent category={category} searchTerm={searchTerm} />
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}

async function BookGridContent({
  category,
  searchTerm,
}: {
  category?: string;
  searchTerm?: string;
}) {
  const initialData = await getLibrosPaginated({
    pageSize: 6,
    orderBy: "asc",
    category,
    searchTerm,
  });

  return (
    <BookGrid
      initialData={initialData}
      category={category}
      searchTerm={searchTerm}
    />
  );
}
