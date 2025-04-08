import { notFound } from "next/navigation";
import { getUsuarioById } from "../actions";
import UsuarioDetailComponent from "./usuario-detail-component";

export const dynamic = "force-dynamic";

interface UsuarioDetailPageProps {
  params: Promise<{
    usuarioId: string;
  }>;
}

export default async function UsuarioDetailPage({
  params,
}: UsuarioDetailPageProps) {
  const { usuarioId } = await params;
  // Get the user by ID
  const usuario = await getUsuarioById(usuarioId);

  // If the user doesn't exist, show a 404 page
  if (!usuario) {
    notFound();
  }

  return <UsuarioDetailComponent usuario={usuario} usuarioId={usuarioId} />;
}
