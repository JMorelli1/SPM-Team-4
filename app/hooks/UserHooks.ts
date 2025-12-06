import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addUserFavorite, fetchUserDetails, removeUserFavorite } from "~/services/userApi";

export const useUserDetails = (userId: string | null) => {
    return useQuery({
        queryKey: ['userDetails', userId],
        queryFn: () => fetchUserDetails(userId),
        staleTime: 10 * 60 * 1000, // 10 minutes
        enabled: !!userId,
    });
}

export const useAddUserFavorite = () => {
    return useMutation({
        mutationKey: ['addUserFavorite'],
        mutationFn: addUserFavorite,
    });
}

export const useRemoveUserFavorite = () => {
    return useMutation({
        mutationKey: ['removeUserFavorite'],
        mutationFn: removeUserFavorite,
    });
}
