"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { type Usuario } from "~/app/admin/reportes/types";

interface UserSelectProps {
  usuarios: Usuario[];
  preselectedUserId?: string;
}

export function UserSelect({ usuarios, preselectedUserId }: UserSelectProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<Usuario | null>(
    preselectedUserId
      ? (usuarios.find((u) => u.clerkId === preselectedUserId) ?? null)
      : null,
  );

  // Filter out bibliotecario users
  const filteredUsuarios = usuarios.filter(
    (user) => user.tipoDeUsuario !== "bibliotecarios",
  );

  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = () => {
    if (!selectedUser) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("userId", selectedUser.clerkId);
    params.set("page", "1"); // Reset to first page

    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[300px] justify-between text-left font-normal"
          >
            {selectedUser ? (
              <span>
                {selectedUser.nombre}
                <span className="ml-2 text-xs text-muted-foreground">
                  ({selectedUser.tipoDeUsuario})
                </span>
              </span>
            ) : (
              "Seleccione un usuario"
            )}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandInput placeholder="Buscar usuario por nombre..." />
            <CommandList>
              <CommandEmpty>No se encontraron usuarios.</CommandEmpty>
              <CommandGroup>
                {filteredUsuarios.map((user) => (
                  <CommandItem
                    key={user.clerkId}
                    value={`${user.nombre} ${user.email}`}
                    onSelect={() => {
                      setSelectedUser(user);
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedUser?.clerkId === user.clerkId
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                    <span className="flex-1">{user.nombre}</span>
                    <span className="text-xs text-muted-foreground">
                      {user.tipoDeUsuario}
                    </span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Button onClick={handleSearch} disabled={!selectedUser}>
        Buscar
      </Button>
    </div>
  );
}
