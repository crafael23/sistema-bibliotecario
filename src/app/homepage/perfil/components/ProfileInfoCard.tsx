import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { User, Phone, BookMarked } from "lucide-react";
import { EditProfileDialog } from "./EditProfileDialog";
import { getUserTypeLabel } from "../schemas";
import type { UserProfileData, TipoDeUsuario } from "../schemas";

interface ProfileInfoCardProps {
  user: {
    nombre: string;
    email: string;
    telefono: string | null;
    direccion: string | null;
    avatarUrl: string;
    tipoDeUsuario: TipoDeUsuario;
  };
}

export const ProfileInfoCard = ({ user }: ProfileInfoCardProps) => {
  const userTypeLabel = getUserTypeLabel(user.tipoDeUsuario);

  return (
    <Card className="col-span-1">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle>Información Personal</CardTitle>
          <CardDescription>Datos de contacto y personales</CardDescription>
        </div>
        <EditProfileDialog
          userData={{
            nombre: user.nombre,
            email: user.email,
            telefono: user.telefono,
            direccion: user.direccion,
            avatarUrl: user.avatarUrl,
          }}
        />
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col items-center space-y-3">
          <Avatar className="h-24 w-24">
            <AvatarImage src={user.avatarUrl} alt={user.nombre} />
            <AvatarFallback className="text-2xl">
              {user.nombre
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <h2 className="text-xl font-semibold">{user.nombre}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <User className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Tipo de Usuario</p>
              <p className="text-sm text-muted-foreground">{userTypeLabel}</p>
            </div>
          </div>

          <div className="items-centers flex gap-2">
            <Phone className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Teléfono</p>
              <p className="text-sm text-muted-foreground">
                {user.telefono ?? "No especificado"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2">
            <BookMarked className="mt-0.5 h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Dirección</p>
              <p className="text-sm text-muted-foreground">
                {user.direccion ?? "No especificada"}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
