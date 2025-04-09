import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { type ReactNode } from "react";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "~/components/ui/card";

interface ReportLayoutProps {
  title: string;
  cardTitle: string;
  cardDescription: string;
  children: ReactNode;
  filterComponent?: ReactNode;
  footerComponent?: ReactNode;
}

export function ReportLayout({
  title,
  cardTitle,
  cardDescription,
  children,
  filterComponent,
  footerComponent,
}: ReportLayoutProps) {
  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link href="/admin/reportes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{title}</h1>
      </div>
      <Card className="mb-8">
        <CardHeader>
          <div className="flex flex-col items-start justify-between gap-3 md:flex-row md:items-center">
            <div>
              <CardTitle>{cardTitle}</CardTitle>
              <CardDescription>{cardDescription}</CardDescription>
            </div>
            {filterComponent && (
              <div className="self-end">{filterComponent}</div>
            )}
          </div>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
      {footerComponent}
    </div>
  );
}
