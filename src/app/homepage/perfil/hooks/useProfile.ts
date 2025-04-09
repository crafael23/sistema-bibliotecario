import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { UserProfileData } from "../schemas";
import { updateUserProfile } from "../actions";

export const useProfile = () => {
  const router = useRouter();

  const handleProfileUpdate = useCallback(
    async (data: UserProfileData) => {
      try {
        await updateUserProfile(data);
        toast.success("Perfil actualizado exitosamente");
        router.refresh();
      } catch (error) {
        console.error("Error updating profile:", error);
        toast.error("Error al actualizar el perfil");
      }
    },
    [router],
  );

  return {
    handleProfileUpdate,
  };
};
