import Link from "next/link";
import { Separator } from "~/components/ui/separator";

export default function Layout({ children }: { children: React.ReactNode }) {
  const currentDate = new Date();
  return (
    <div>
      <header>
        <nav className="flex w-full items-center justify-between">
          <h1 className="text-xl font-bold">Panel de Reportes</h1>
          <h1 className="text-sm">
            {currentDate.toLocaleDateString("es-ES", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h1>
        </nav>
        <Separator />
      </header>
      <main className="container mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
