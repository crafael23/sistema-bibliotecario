import type React from "react";
import { type Metadata } from "next";
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "../styles/globals.css";
import Navigation from "~/components/navigation";
const inter = Inter({ subsets: ["latin"] });
import { esES } from "@clerk/localizations";
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
    <ClerkProvider localization={esES}>
      <html lang="es">
        <body className={inter.className}>
          <div className="min-h-screen bg-gray-100">
            <Navigation />
            <main className="container mx-auto px-4 py-6">{children}</main>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
