import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { AlertCircle, BookOpen, CreditCard } from "lucide-react";

interface ErrorStateProps {
  title: string;
  description: string;
  icon: "book" | "credit-card";
  onRetry?: () => void;
}

export const ErrorState = ({
  title,
  description,
  icon,
  onRetry,
}: ErrorStateProps) => {
  const Icon = icon === "book" ? BookOpen : CreditCard;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Icon className="h-5 w-5" />
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <p className="text-destructive">Error al cargar los datos</p>
          {onRetry && (
            <Button variant="outline" onClick={onRetry} className="mt-4">
              Reintentar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
