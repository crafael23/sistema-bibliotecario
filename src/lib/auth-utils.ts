import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUsuario } from "~/server/db/queries";

export async function handleInitialAuthRouting(): Promise<void> {
  const { userId, redirectToSignIn } = await auth();

  if (!userId) {
    redirectToSignIn();
    return;
  }
  const dbUserInfo = await getUsuario(userId);

  if (dbUserInfo) {
    if (dbUserInfo.nuevo) {
      redirect("/usuario/" + userId + "/new-user");
    }

    if (dbUserInfo.tipoDeUsuario === "bibliotecarios") {
      redirect("/admin/");
    }

    if (
      dbUserInfo.tipoDeUsuario === "externos" ||
      dbUserInfo.tipoDeUsuario === "estudiantes" ||
      dbUserInfo.tipoDeUsuario === "docentes"
    ) {
      return;
    }
  }
}
