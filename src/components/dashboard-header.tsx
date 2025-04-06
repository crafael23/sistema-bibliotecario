"use client"

import type React from "react"

import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Plus, Search } from "lucide-react"
import { useState } from "react"
import { AddBookDialog } from "./add-book-dialog"

interface DashboardHeaderProps {
  title: string
  showSearch?: boolean
  showAddButton?: boolean
  searchPlaceholder?: string
  onSearch?: (query: string) => void
}

export function DashboardHeader({
  title,
  showSearch = false,
  showAddButton = false,
  searchPlaceholder = "Buscar...",
  onSearch,
}: DashboardHeaderProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [openAddBookDialog, setOpenAddBookDialog] = useState(false)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    if (onSearch) {
      onSearch(query)
    }
  }

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 p-4 md:p-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white">{title}</h1>
        <div className="flex flex-wrap items-center gap-2">
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder={searchPlaceholder}
                className="pl-8 min-w-[200px] bg-white/95"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          )}
          {showAddButton && (
            <Button onClick={() => setOpenAddBookDialog(true)} className="bg-gray-100 text-black hover:bg-gray-200">
              <Plus className="mr-2 h-4 w-4" />
              Agregar Libro
            </Button>
          )}
        </div>
      </div>

      <AddBookDialog open={openAddBookDialog} onOpenChange={setOpenAddBookDialog} />
    </>
  )
}

