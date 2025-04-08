"use client";

import { useState, useEffect, useCallback } from "react";
import { Menu, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Button } from "~/components/ui/button";
import CategoryList from "./category-list";
import { getCategorias } from "../../actions";
import { LoadingSpinner } from "~/components/ui/loading-spinner";

type CategoryMenuProps = {
  onCategorySelect: (category: string) => void;
};

export default function CategoryMenu({ onCategorySelect }: CategoryMenuProps) {
  const [selectedCategory, setSelectedCategory] = useState(
    "Todas las categorías",
  );
  const [categories, setCategories] = useState<
    Awaited<ReturnType<typeof getCategorias>>
  >([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCategorySelect = useCallback(
    (category: string) => {
      setSelectedCategory(category);
      onCategorySelect(category);
    },
    [onCategorySelect],
  );

  // Fetch categories on mount
  useEffect(() => {
    let isMounted = true;

    const fetchCategories = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getCategorias();
        if (isMounted) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        if (isMounted) {
          setError("Error al cargar las categorías");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void fetchCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-2">
          <Menu className="h-5 w-5" />
          <span className="hidden sm:inline">Categorías</span>
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        <DropdownMenuLabel>Categorías</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isLoading ? (
          <div className="flex items-center justify-center p-4">
            <LoadingSpinner size="sm" />
          </div>
        ) : error ? (
          <div className="p-4 text-center text-sm text-red-500">{error}</div>
        ) : (
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleCategorySelect}
          />
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
