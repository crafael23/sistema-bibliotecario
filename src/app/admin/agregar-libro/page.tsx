import AgregarLibroForm from "./agregar-libro-form";
import { getCategorias } from "~/server/db/queries";

export default async function AgregarLibroPage() {
  // Get categories from database
  const categorias = await getCategorias();

  return <AgregarLibroForm categorias={categorias} />;
}
