import { UserProfileForm } from "~/components/user-profile-form";
import { getUsuario, nuevoUsuarioUpdate } from "~/server/db/queries";
import { formSchema } from "./form-schema";
import { redirect } from "next/navigation";

// Esquema de validación para el formulario
export const dynamic = "force-dynamic";

export default async function NewUserPage({
  params,
}: {
  params: Promise<{ userid: string }>;
}) {
  const { userid } = await params;

  console.log(userid);

  const userData = await getUsuario(userid);

  async function postUserData(formData: FormData) {
    "use server";
    console.log("Datos enviados: ", formData);

    const parsedData = formSchema.safeParse(Object.fromEntries(formData));

    if (parsedData.success === false) {
      console.log("Error al actualizar los datos:", parsedData.error);
      return new Response("Error al actualizar los datos", {
        status: 400,
      });
    }

    const { telefono, direccion, identidad } = parsedData.data;

    await nuevoUsuarioUpdate(userid, telefono, direccion, identidad);

    redirect("/");
  }

  return (
    <div>
      <div className="container mx-auto px-4 py-10">
        <h1 className="mb-8 text-3xl font-bold">Completar Perfil de Usuario</h1>
        <UserProfileForm userData={userData!} action={postUserData} />
      </div>
    </div>
  );
}
