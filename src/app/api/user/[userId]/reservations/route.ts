import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getReservacionesByUsuario } from "~/server/db/queries";

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

    // Get the user's reservations
    const reservations = await getReservacionesByUsuario(params.userId);

    // Transform the data to match the expected format in the frontend
    const formattedReservations = reservations.map((res) => ({
      id: res.id,
      codigoReferencia: res.codigoReferencia || `RES-${res.id}`,
      estado: res.estado,
      fechaReserva: res.fechaReserva,
      fechaVencimiento: res.fechaVencimiento,
      libro: {
        id: res.libroId,
        nombre: res.libroNombre,
        autor: res.libroAutor,
        codigo: res.libroCodigo,
      },
    }));

    return NextResponse.json(formattedReservations);
  } catch (error) {
    console.error("Error fetching reservations:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 },
    );
  }
}
