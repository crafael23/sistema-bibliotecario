import UsuariosComponent from "./usuarios-component";
import {
  getUsuariosPaginated,
  getUsuariosAction,
  searchUsuariosAction,
} from "./actions";

export const dynamic = "force-dynamic";

export default async function UsuariosPage() {
  // Get initial data
  const initialData = await getUsuariosPaginated(undefined, 5);

  return (
    <UsuariosComponent
      initialData={initialData}
      getUsuariosAction={getUsuariosAction}
      searchUsuariosAction={searchUsuariosAction}
    />
  );
}
