import { useQuery } from "@tanstack/react-query"
import { fetchActorById, fetchDiscoverMovies, fetchMovieById, fetchMovieCreditsById,fetchActorCreditsById, fetchMovieBannerDiscover } from "~/services/movieApi";

export const useMovieDiscover = (query: string, pageNumber: number) => {
    return useQuery({
        queryKey: ['movieDiscover', query, pageNumber],
        queryFn: () => fetchDiscoverMovies(query, pageNumber),
        staleTime: 5 * 60 * 1000, // 5 minutes
        enabled: !!query,
    }
    );
}

export const useMovieById = (movieId: string | number) => {
    return useQuery({
        queryKey: ['movieById', movieId],
        queryFn: () => fetchMovieById(movieId),
        staleTime: 10 * 60 * 1000, // 10 minutes
        enabled: !!movieId,
    });
}

export const useActorById = (actorId: string | number) => {
    return useQuery({
        queryKey: ['actorById', actorId],
        queryFn: () => fetchActorById(actorId),
        staleTime: 10 * 60 * 1000, // 10 minutes
        enabled: !!actorId,
    });
}


export const useMovieCreditsById = (movieId: string | number) => {
    return useQuery({
        queryKey: ['movieCreditsById', movieId],
        queryFn: () => fetchMovieCreditsById(movieId),
        staleTime: 10 * 60 * 1000, // 10 minutes
        enabled: !!movieId,
    });
}

export const useActorCreditsById = (actorId: string | number) => {
    return useQuery({
        queryKey: ['actorCreditsById', actorId],
        queryFn: () => fetchActorCreditsById(actorId),
        staleTime: 10 * 60 * 1000, // 10 minutes
        enabled: !!actorId,
    });
}

export const useMovieBannerDiscover = (genre?: string) => {
    return useQuery({
        queryKey: ['movieDiscover', genre],
        queryFn: () => fetchMovieBannerDiscover(genre),
        staleTime: 10 * 60 * 1000, // 10 minutes
        enabled: true,
    });
}