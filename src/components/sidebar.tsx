"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Book,
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  Menu,
  Plus,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "~/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/lib/utils";

export function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detectar si es móvil
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const isActive = (path: string) => {
    if (path === "/admin") return pathname === path;
    return pathname.startsWith(path);
  };

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-20 flex h-16 items-center gap-4 border-b bg-gray-100 px-4 md:px-6">
        {isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <Link href="/admin" className="flex items-center gap-2 font-semibold">
          <Book className="h-6 w-6" />
          <span>Sistema Bibliotecario</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Avatar className="h-9 w-9 cursor-pointer border-2 border-gray-200 transition-colors hover:border-gray-300">
            <AvatarImage src="" alt="Foto de perfil" />
            <AvatarFallback className="bg-gray-200 text-gray-700">
              <Users className="h-5 w-5" />
            </AvatarFallback>
          </Avatar>
        </div>
      </header>

      <div className="flex min-h-screen pt-16">
        {/* Menú móvil */}
        {isMobile && mobileMenuOpen && (
          <div
            className="fixed inset-0 z-10 bg-black/50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div
              className="absolute bottom-0 left-0 top-0 flex w-64 flex-col overflow-auto bg-[#61cee2] p-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="-m-4 mb-4 mb-6 flex items-center justify-between bg-[#f34638] p-4">
                <div className="flex items-center gap-2">
                  <img
                    src="/images/logo.jpeg"
                    alt="Logo Casa de la Cultura"
                    className="h-10 w-10"
                  />
                  <span className="font-semibold text-white">
                    Casa de la cultura
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-white"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <nav className="grid gap-2 text-sm">
                <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-2 text-white hover:bg-white/20",
                      isActive("/admin") && "bg-white/20",
                    )}
                  >
                    <Home className="h-5 w-5 flex-shrink-0" />
                    <span>Página Principal</span>
                  </Button>
                </Link>
                <Link
                  href="/admin/inventario"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-2 text-white hover:bg-white/20",
                      isActive("/admin/inventario") && "bg-white/20",
                    )}
                  >
                    <Book className="h-5 w-5 flex-shrink-0" />
                    <span>Inventario</span>
                  </Button>
                </Link>
                <Link
                  href="/admin/usuarios"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-2 text-white hover:bg-white/20",
                      isActive("/admin/usuarios") && "bg-white/20",
                    )}
                  >
                    <Users className="h-5 w-5 flex-shrink-0" />
                    <span>Usuarios</span>
                  </Button>
                </Link>
                <Link
                  href="/admin/reportes"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-2 text-white hover:bg-white/20",
                      isActive("/admin/reportes") && "bg-white/20",
                    )}
                  >
                    <FileText className="h-5 w-5 flex-shrink-0" />
                    <span>Reportes</span>
                  </Button>
                </Link>
                <Link
                  href="/admin/agregar-libro"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Button
                    variant="ghost"
                    className="justify-start gap-2 text-white hover:bg-white/20"
                  >
                    <Plus className="h-5 w-5 flex-shrink-0" />
                    <span>Agregar Libro</span>
                  </Button>
                </Link>
              </nav>
            </div>
          </div>
        )}

        {/* Barra lateral para escritorio */}
        <aside
          className={cn(
            "flex-col border-r border-white/20 bg-[#61cee2] text-white transition-all duration-300 ease-in-out",
            sidebarCollapsed ? "md:w-[70px]" : "md:w-[220px]",
            "fixed left-0 top-16 z-10 hidden h-[calc(100vh-4rem)] md:flex",
          )}
        >
          <div
            className={cn(
              "flex items-center justify-center border-b border-white/20 bg-[#f34638] p-4",
              sidebarCollapsed ? "flex-col" : "flex-col",
            )}
          >
            <img
              src="/images/logo.jpeg"
              alt="Logo Casa de la Cultura"
              className="mb-2 h-12 w-12"
            />
            {!sidebarCollapsed && (
              <span className="text-center font-semibold">
                Casa de la cultura
              </span>
            )}
          </div>
          <nav className="grid gap-2 overflow-y-auto p-4 text-sm">
            <Link href="/admin">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 text-white hover:bg-white/20",
                  isActive("/admin") && pathname === "/admin" && "bg-white/20",
                  sidebarCollapsed && "justify-center px-2",
                )}
              >
                <Home className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Página Principal</span>}
              </Button>
            </Link>
            <Link href="/admin/inventario">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 text-white hover:bg-white/20",
                  isActive("/admin/inventario") && "bg-white/20",
                  sidebarCollapsed && "justify-center px-2",
                )}
              >
                <Book className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Inventario</span>}
              </Button>
            </Link>
            <Link href="/admin/usuarios">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 text-white hover:bg-white/20",
                  isActive("/admin/usuarios") && "bg-white/20",
                  sidebarCollapsed && "justify-center px-2",
                )}
              >
                <Users className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Usuarios</span>}
              </Button>
            </Link>
            <Link href="/admin/reportes">
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-2 text-white hover:bg-white/20",
                  isActive("/admin/reportes") && "bg-white/20",
                  sidebarCollapsed && "justify-center px-2",
                )}
              >
                <FileText className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Reportes</span>}
              </Button>
            </Link>
            <Link href="/admin/agregar-libro">
              <Button
                variant="ghost"
                className={cn(
                  "justify-start gap-2 text-white hover:bg-white/20",
                  isActive("/admin/agregar-libro") && "bg-white/20",
                  sidebarCollapsed && "justify-center px-2",
                )}
              >
                <Plus className="h-5 w-5 flex-shrink-0" />
                {!sidebarCollapsed && <span>Agregar Libro</span>}
              </Button>
            </Link>
          </nav>
          <div className="mt-auto border-t border-white/20 p-4">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center text-white hover:bg-white/20"
              onClick={toggleSidebar}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <ChevronLeft className="h-5 w-5" />
              )}
            </Button>
          </div>
        </aside>

        {/* Contenido principal */}
        <div
          className={cn(
            "flex min-h-screen w-full flex-1 flex-col",
            "md:ml-[220px]",
            sidebarCollapsed && "md:ml-[70px]",
            "transition-all duration-300 ease-in-out",
          )}
        >
          {children}
        </div>
      </div>
    </>
  );
}
