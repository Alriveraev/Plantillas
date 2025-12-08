// src/hooks/useSessions.ts
import { useQuery } from "@tanstack/react-query";
import { profileService } from "@/features/profile/services/profile.service";

export const useSessions = () => {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: profileService.getSessions,
    staleTime: 1000 * 60 * 5, // Cache de 5 minutos
    retry: 1,
  });
};
