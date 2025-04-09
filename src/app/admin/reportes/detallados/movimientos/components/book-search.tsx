"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

interface BookSearchProps {
  initialValue?: string;
}

export function BookSearch({ initialValue }: BookSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [bookId, setBookId] = useState(initialValue ?? "");

  const handleSearch = () => {
    if (!bookId.trim()) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("libroId", bookId);
    params.set("page", "1"); // Reset to first page

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex flex-col gap-1">
      <Label htmlFor="libro">Buscar otro libro</Label>
      <div className="mt-1 flex gap-2">
        <Input
          id="libro"
          placeholder="ID o nombre del libro"
          value={bookId}
          onChange={(e) => setBookId(e.target.value)}
        />
        <Button onClick={handleSearch}>Buscar</Button>
      </div>
    </div>
  );
}
