"use client"

import type React from "react"

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { ArrowLeft, Calendar, Plus, Search } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface PageHeaderProps {
  title: string
  icon?: React.ReactNode
  showSearch?: boolean
  showAddButton?: boolean
  searchPlaceholder?: string
  onSearch?: (query: string) => void
  backUrl?: string
  showDateTime?: boolean
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
}: PageHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const pathname = usePathname()
  const [currentDate, setCurrentDate] = useState("")
  const [currentTime, setCurrentTime] = useState("")

  // Si no se proporciona una URL de retorno específica, determinar automáticamente
  const shouldShowBackButton = pathname !== "/admin"
  const effectiveBackUrl = backUrl || (pathname.includes("/admin/reportes/") ? "/admin/reportes" : "/admin")

  useEffect(() => {
    if (showDateTime) {
      const updateDateTime = () => {
        const now = new Date()
        setCurrentDate(
          now.toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }),
        )
        setCurrentTime(
          now.toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        )
      }

      updateDateTime()
      const interval = setInterval(updateDateTime, 60000) // Actualizar cada minuto

      return () => clearInterval(interval)
    }
  }, [showDateTime])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    if (onSearch) {
      onSearch(query)
    }
  }

  return (
    <div className="mb-6 w-full">
      <div className="flex items-center justify-between p-4 md:p-6 w-full">
        <div className="flex items-center gap-3">
          {shouldShowBackButton && (
            <Link href={effectiveBackUrl}>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
          )}
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            {icon}
            {title}
          </h1>
        </div>

        {showDateTime && (
          <div className="flex items-center gap-2 bg-white/90 p-2 rounded-md shadow text-sm ml-auto">
            <Calendar className="h-4 w-4" />
            <span>{currentDate}</span>
            <span>|</span>
            <span>{currentTime}</span>
          </div>
        )}
      </div>

      {(showSearch || showAddButton) && (
        <div className="flex flex-wrap items-center justify-end gap-4 px-4 md:px-6 pb-4 md:pb-6">
          {showSearch && (
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={searchPlaceholder}
                className="pl-8 w-full bg-white/95"
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
  )
}

