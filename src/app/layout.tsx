import type React from "react";
import "../styles/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navigation from "~/components/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sistema de Gestión de Biblioteca",
  description: "Un sistema simple de gestión de biblioteca",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-100">
          <Navigation />
          <main className="container mx-auto px-4 py-6">{children}</main>
        </div>
      </body>
    </html>
  );
}
