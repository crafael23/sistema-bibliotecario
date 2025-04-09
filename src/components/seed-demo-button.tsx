"use client";

import { Button } from "~/components/ui/button";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface SeedDemoButtonProps {
  action: () => Promise<{ success: boolean; message: string }>;
}

export default function SeedDemoButton({ action }: SeedDemoButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const result = await action();
      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error(
        `Error al generar datos de demostración: ${(error as Error).message}`,
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading}
      className="ml-4 bg-blue-600 text-white hover:bg-blue-700"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Generando datos...
        </>
      ) : (
        "Generar datos de demo"
      )}
    </Button>
  );
}
