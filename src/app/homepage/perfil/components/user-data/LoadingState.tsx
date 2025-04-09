import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { AlertCircle, BookOpen, CreditCard } from "lucide-react";

interface LoadingStateProps {
  title: string;
  description: string;
  icon: "book" | "credit-card";
}

export const LoadingState = ({
  title,
  description,
  icon,
}: LoadingStateProps) => {
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
        <div className="flex justify-center py-8">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
        </div>
      </CardContent>
    </Card>
  );
};
