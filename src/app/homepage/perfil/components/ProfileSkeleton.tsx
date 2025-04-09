import { Skeleton } from "~/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

export const ProfileSkeleton = () => {
  return (
    <div className="container mx-auto space-y-6 py-6">
      <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
        <Skeleton className="h-10 w-60" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <Card className="col-span-1">
          <CardHeader>
            <Skeleton className="mb-2 h-7 w-40" />
            <Skeleton className="h-5 w-60" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-col items-center space-y-3">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="text-center">
                <Skeleton className="mx-auto mb-2 h-6 w-40" />
                <Skeleton className="mx-auto h-4 w-32" />
              </div>
            </div>

            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-start gap-2">
                  <Skeleton className="mt-0.5 h-5 w-5" />
                  <div className="flex-1">
                    <Skeleton className="mb-1 h-4 w-24" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="col-span-1 md:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="mb-2 h-7 w-40" />
              <Skeleton className="h-5 w-60" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
