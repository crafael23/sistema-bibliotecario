import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getMultasByUsuario } from "~/server/db/queries";

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  try {
    // Get the authenticated user
    const { userId: authUserId, redirectToSignIn } = await auth();

    // Check if the user is authenticated
    if (!authUserId) {
      redirectToSignIn();
    }

    // Check if the user is requesting their own data
    if (authUserId !== params.userId) {
      return NextResponse.json({ error: "No autorizado" }, { status: 403 });
    }

    // Get the user's fines
    const fines = await getMultasByUsuario(params.userId);

    return NextResponse.json(fines);
  } catch (error) {
    console.error("Error fetching fines:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
