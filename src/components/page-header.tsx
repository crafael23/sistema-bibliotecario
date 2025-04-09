"use client";

import type React from "react";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { ArrowLeft, Calendar, Plus, Search } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface PageHeaderProps {
  title: string;
  icon?: React.ReactNode;
  showSearch?: boolean;
  showAddButton?: boolean;
  searchPlaceholder?: string;
  onSearch?: (query: string) => void;
  backUrl?: string;
  showDateTime?: boolean;
  action?: React.ReactNode;
}

export function PageHeader({
  title,
  icon,
  showSearch = false,
  showAddButton = false,
  searchPlaceholder = "Buscar...",
  onSearch,
  backUrl,
  showDateTime = false,
  action,
}: PageHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const pathname = usePathname();
  const [currentDate, setCurrentDate] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  // Si no se proporciona una URL de retorno específica, determinar automáticamente
  const shouldShowBackButton = pathname !== "/admin";
  const effectiveBackUrl =
    backUrl ??
    (pathname.includes("/admin/reportes/") ? "/admin/reportes" : "/admin");

  useEffect(() => {
    // Handle window for client-side only
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (showDateTime) {
      const updateDateTime = () => {
        const now = new Date();
        setCurrentDate(
          now.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
        );
        setCurrentTime(
          now.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        );
      };

      updateDateTime();
      const interval = setInterval(updateDateTime, 60000); // Actualizar cada minuto

      return () => clearInterval(interval);
    }
  }, [showDateTime]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <div className="mb-6 w-full">
      <div className="flex w-full items-center justify-between p-4 md:p-6">
        <div className="flex items-center gap-3">
          {shouldShowBackButton && (
            <Link href={effectiveBackUrl}>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          )}
          <h1 className="flex items-center gap-2 text-xl font-bold text-white sm:text-2xl">
            {icon}
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          {action && <div className="hidden md:block">{action}</div>}

          {showDateTime && (
            <div className="ml-auto flex items-center gap-2 rounded-md bg-white/90 p-2 text-sm shadow">
              <Calendar className="h-4 w-4" />
              <span>{currentDate}</span>
              <span>|</span>
              <span>{currentTime}</span>
            </div>
          )}
        </div>
      </div>

      {(showSearch || showAddButton || (action && isMobile)) && (
        <div className="flex flex-wrap items-center justify-end gap-4 px-4 pb-4 md:px-6 md:pb-6">
          {action && (
            <div className="flex w-full justify-end md:hidden">{action}</div>
          )}

          {showSearch && (
            <div className="relative max-w-md flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={searchPlaceholder}
                className="w-full bg-white/95 pl-8"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          )}
          {showAddButton && (
            <Link href="/admin/agregar-libro">
              <Button className="bg-gray-200 text-black hover:bg-gray-300">
                <Plus className="mr-2 h-4 w-4" />
                Agregar Libro
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
