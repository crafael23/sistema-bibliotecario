import { Card, CardContent } from "~/components/ui/card";
import { PageHeader } from "~/components/page-header";
import { BookMarked } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Skeleton } from "~/components/ui/skeleton";

/**
 * Skeleton loading component for the reservas page
 * Shows loading placeholders for UI elements
 */
export function PageSkeleton() {
  return (
    <>
      <PageHeader
        title="Gestión de Reservas"
        icon={<BookMarked className="h-6 w-6" />}
        showSearch={true}
      />

      <main className="w-full flex-1 overflow-auto px-4 pb-6 md:px-6">
        <Tabs defaultValue="pendientes" className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-3">
            <TabsTrigger value="pendientes" className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </TabsTrigger>
            <TabsTrigger value="realizadas" className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </TabsTrigger>
            <TabsTrigger value="recibidas" className="flex items-center gap-2">
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </TabsTrigger>
          </TabsList>

          {/* Loading skeleton for table */}
          <Card className="bg-gray-100 shadow-md">
            <CardContent className="p-0">
              <div className="w-full overflow-x-auto p-4">
                <Skeleton className="mb-6 h-10 w-full" />
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="mb-4 h-16 w-full" />
                ))}
              </div>
            </CardContent>
          </Card>
        </Tabs>
      </main>
    </>
  );
}
