"use client";

import { useState } from "react";
import { PageHeader } from "~/components/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  BookMarked,
  Check,
  Clock,
  Info,
  BookOpen,
  RotateCcw,
} from "lucide-react";
import { PendingReservations } from "./PendingReservations";
import { ActiveReservations } from "./ActiveReservations";
import { ReturnedReservations } from "./ReturnedReservations";
import type { ReservacionWithDetails } from "../actions";

export interface ReservasManagementProps {
  initialPendingData: {
    items: ReservacionWithDetails[];
    nextCursor: number | null;
    hasNextPage: boolean;
    totalCount: number;
    totalPages: number;
    currentPage: number;
  };
  initialActiveData: {
    items: ReservacionWithDetails[];
    nextCursor: number | null;
    hasNextPage: boolean;
    totalCount: number;
    totalPages: number;
    currentPage: number;
  };
  initialReturnedData: {
    items: ReservacionWithDetails[];
    nextCursor: number | null;
    hasNextPage: boolean;
    totalCount: number;
    totalPages: number;
    currentPage: number;
  };
}

export function ReservasManagement({
  initialPendingData,
  initialActiveData,
  initialReturnedData,
}: ReservasManagementProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("pendientes");

  return (
    <>
      <PageHeader
        title="Gestión de Reservas"
        icon={<BookMarked className="h-6 w-6" />}
        showSearch={true}
        searchPlaceholder="Buscar por usuario, libro o código..."
        onSearch={setSearchQuery}
      />
      <main className="w-full flex-1 overflow-auto px-2 pb-6 sm:px-4 md:px-6">
        <Tabs
          defaultValue="pendientes"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="mb-4 grid w-full grid-cols-3 sm:mb-6">
            <TabsTrigger
              value="pendientes"
              className="flex items-center gap-1 px-1 py-1.5 text-xs sm:gap-2 sm:px-2 sm:py-2 sm:text-sm"
            >
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span className="xs:inline hidden">Pendientes</span>
              <span className="xs:hidden">Pend.</span>
              {initialPendingData.totalCount > 0 && (
                <div className="ml-1 rounded-full bg-gray-200 px-1.5 py-0.5 text-xs font-medium text-gray-800 sm:ml-2 sm:px-2">
                  {initialPendingData.totalCount}
                </div>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="realizadas"
              className="flex items-center gap-1 px-1 py-1.5 text-xs sm:gap-2 sm:px-2 sm:py-2 sm:text-sm"
            >
              <BookOpen className="h-4 w-4 flex-shrink-0" />
              <span className="xs:inline hidden">Realizadas</span>
              <span className="xs:hidden">Real.</span>
              {initialActiveData.totalCount > 0 && (
                <div className="ml-1 rounded-full bg-gray-200 px-1.5 py-0.5 text-xs font-medium text-gray-800 sm:ml-2 sm:px-2">
                  {initialActiveData.totalCount}
                </div>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="recibidas"
              className="flex items-center gap-1 px-1 py-1.5 text-xs sm:gap-2 sm:px-2 sm:py-2 sm:text-sm"
            >
              <Check className="h-4 w-4 flex-shrink-0" />
              <span className="xs:inline hidden">Recibidas</span>
              <span className="xs:hidden">Recib.</span>
              {initialReturnedData.totalCount > 0 && (
                <div className="ml-1 rounded-full bg-gray-200 px-1.5 py-0.5 text-xs font-medium text-gray-800 sm:ml-2 sm:px-2">
                  {initialReturnedData.totalCount}
                </div>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Pestaña de Pendientes de Entrega */}
          <TabsContent value="pendientes" className="mt-0">
            <PendingReservations
              initialData={initialPendingData}
              searchQuery={searchQuery}
            />
          </TabsContent>

          {/* Pestaña de Entregas Realizadas */}
          <TabsContent value="realizadas" className="mt-0">
            <ActiveReservations
              initialData={initialActiveData}
              searchQuery={searchQuery}
            />
          </TabsContent>

          {/* Pestaña de Entregas Recibidas */}
          <TabsContent value="recibidas" className="mt-0">
            <ReturnedReservations
              initialData={initialReturnedData}
              searchQuery={searchQuery}
            />
          </TabsContent>
        </Tabs>
      </main>
    </>
  );
}
