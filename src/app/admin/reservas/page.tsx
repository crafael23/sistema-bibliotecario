import { ReservasManagement } from "./components/ReservasManagement";
import {
  getPendingReservaciones,
  getActiveReservaciones,
  getReturnedReservaciones,
} from "./actions";
import { Suspense } from "react";
import { PageSkeleton } from "./components";

export const metadata = {
  title: "Gestión de Reservas - Sistema Bibliotecario",
  description: "Gestione las reservas de libros en el sistema bibliotecario",
};

export default async function ReservasPage() {
  // Fetch initial data for each tab with larger page size for better initial experience
  const initialPendingData = await getPendingReservaciones({ pageSize: 15 });
  const initialActiveData = await getActiveReservaciones({ pageSize: 15 });
  const initialReturnedData = await getReturnedReservaciones({ pageSize: 15 });

  return (
    <Suspense fallback={<PageSkeleton />}>
      <ReservasManagement
        initialPendingData={initialPendingData}
        initialActiveData={initialActiveData}
        initialReturnedData={initialReturnedData}
      />
    </Suspense>
  );
}
