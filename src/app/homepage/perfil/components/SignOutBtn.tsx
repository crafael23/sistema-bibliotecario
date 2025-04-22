"use client";

import { SignOutButton } from "@clerk/nextjs";
import { Button } from "~/components/ui/button";
import { LogOut } from "lucide-react";

export function SignOutBtn() {
  return (
    <SignOutButton>
      <Button variant="outline" className="flex items-center gap-2">
        <LogOut className="h-4 w-4" />
        Cerrar Sesión
      </Button>
    </SignOutButton>
  );
}
