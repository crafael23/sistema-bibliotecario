"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { debounce } from "lodash";
import CategoryMenu from "./category-menu/category-menu";
import SearchBar from "./search-bar/search-bar";

type DebouncedSearchFunction = (searchTerm: string) => void;

export default function SearchControls() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateUrl = useCallback(
    (params: URLSearchParams) => {
      const newUrl = `/homepage?${params.toString()}`;
      router.push(newUrl);
    },
    [router],
  );

  const handleCategorySelect = useCallback(
    (category: string) => {
      const params = new URLSearchParams(searchParams);
      if (category === "Todas las categorías") {
        params.delete("category");
      } else {
        params.set("category", category);
      }
      updateUrl(params);
    },
    [searchParams, updateUrl],
  );

  const debouncedSearch = useMemo(
    () =>
      debounce((searchTerm: string) => {
        const params = new URLSearchParams(searchParams);
        if (searchTerm) {
          params.set("search", searchTerm);
        } else {
          params.delete("search");
        }
        updateUrl(params);
      }, 300) as DebouncedSearchFunction,
    [searchParams, updateUrl],
  );

  const handleSearch = useCallback(
    (searchTerm: string) => {
      debouncedSearch(searchTerm);
    },
    [debouncedSearch],
  );

  return (
    <div className="mt-6 flex items-center justify-between">
      <CategoryMenu onCategorySelect={handleCategorySelect} />
      <SearchBar onSearch={handleSearch} />
    </div>
  );
}
