import { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { BookOpen, AlertCircle } from "lucide-react";
import { currentUser } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { getUsuario } from "~/server/db/queries";
import { redirect } from "next/navigation";
import { type tipoDeUsuarioEnum } from "~/server/db/schema";
import { ProfileHeader } from "./components/ProfileHeader";
import { ProfileInfoCard } from "./components/ProfileInfoCard";
import { ProfileSkeleton } from "./components/ProfileSkeleton";
import { UserFines, UserReservations } from "./components/user-data";
import { SignOutBtn } from "./components/SignOutBtn";

async function ProfileContent() {
  // Get the authenticated user from Clerk
  const { userId, redirectToSignIn } = await auth();
  if (!userId) {
    redirectToSignIn();
  }

  const clerkUser = await currentUser();
  if (!clerkUser) {
    redirect("/sign-in");
  }

  // Get the user data from our database
  const dbUser = await getUsuario(userId!);
  if (!dbUser) {
    // This could happen if the webhook hasn't synced yet
    // Redirect to create profile page
    redirect("/usuario/new-user");
  }

  // Combine the user data from Clerk and our database
  const user = {
    clerkId: dbUser.clerkId,
    nombre: dbUser.nombre,
    email: dbUser.email,
    telefono: dbUser.telefono,
    direccion: dbUser.direccion,
    identidad: dbUser.identidad,
    tipoDeUsuario: dbUser.tipoDeUsuario,
    avatarUrl: clerkUser.imageUrl ?? "/placeholder.svg?height=96&width=96",
    nuevo: dbUser.nuevo,
  };

  return (
    <div className="container mx-auto space-y-6 py-6">
      <ProfileHeader />
      <div className="flex justify-end">
        <SignOutBtn />
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <ProfileInfoCard user={user} />
        <div className="col-span-1 md:col-span-2">
          <Tabs defaultValue="reservations" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="reservations">
                <BookOpen className="mr-2 h-4 w-4" />
                Reservaciones
              </TabsTrigger>
              <TabsTrigger value="fines">
                <AlertCircle className="mr-2 h-4 w-4" />
                Multas
              </TabsTrigger>
            </TabsList>
            <TabsContent value="reservations" className="mt-4">
              <UserReservations userId={user.clerkId} />
            </TabsContent>
            <TabsContent value="fines" className="mt-4">
              <UserFines userId={user.clerkId} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

export default function UserProfilePage() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent />
    </Suspense>
  );
}
