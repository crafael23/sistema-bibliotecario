import { notFound } from "next/navigation";
import { getUsuarioById } from "../actions";
import UsuarioDetailComponent from "./usuario-detail-component";

export const dynamic = "force-dynamic";

interface UsuarioDetailPageProps {
  params: {
    usuarioId: string;
  };
}

export default async function UsuarioDetailPage({
  params,
}: UsuarioDetailPageProps) {
  // Get the user by ID
  const usuario = await getUsuarioById(params.usuarioId);

  // If the user doesn't exist, show a 404 page
  if (!usuario) {
    notFound();
  }

  return (
    <UsuarioDetailComponent usuario={usuario} usuarioId={params.usuarioId} />
  );
}
