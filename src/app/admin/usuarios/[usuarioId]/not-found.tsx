"use client";

import { Button } from "~/components/ui/button";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <div className="flex h-[60vh] flex-col items-center justify-center gap-6 text-center">
      <h2 className="text-3xl font-bold">Usuario no encontrado</h2>
      <p className="max-w-md text-muted-foreground">
        No pudimos encontrar el usuario que estás buscando. Es posible que haya
        sido eliminado o que la URL sea incorrecta.
      </p>
      <Button onClick={() => router.push("/admin/usuarios")}>
        Volver a la lista de usuarios
      </Button>
    </div>
  );
}
