import { useQuery } from "@tanstack/react-query"
import { fetchDiscoverMovies, fetchMovieById } from "~/services/movieApi";

export const useMovieDiscover = (query: string, pageNumber: number) => {
    return useQuery({
        queryKey: ['movieDiscover', query, pageNumber],
        queryFn: () => fetchDiscoverMovies(query, pageNumber),
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!query,
    }
    );
}