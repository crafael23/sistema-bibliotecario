import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Perfil de Usuario | Sistema Bibliotecario",
  description: "Gestiona tu información personal, reservaciones y multas",
};

export default function PerfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <div className="flex-1">{children}</div>
    </div>
  );
}
