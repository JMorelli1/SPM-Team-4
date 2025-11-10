import type { ActorCredits } from "~/types/ActorCredits";
import type { ActorDescription } from "~/types/ActorDescription";
import type { MovieCredits } from "~/types/MovieCredits";
import type { MovieDescription } from "~/types/MovieDescription";
import type { MovieDiscover } from "~/types/MovieDiscover";

const isLocal = import.meta.env.VITE_IS_LOCAL ?? false;
const proxyURL = 'https://spm-team-4-mgv2.vercel.app/api/proxy';
const apiBaseUrl = '/api/movies';

const defaultHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`
}

const buildUrl = (path: string, queryParams?: Record<string, any>) => {
    const baseUrl = isLocal ? `${apiBaseUrl}${path}` : `${proxyURL}` // Set proxy when non local
    const params = buildQueryParams(queryParams ?? {}, path)
    return `${baseUrl}${params.size !== 0 ? `?${params}`: ''}`
}

const buildQueryParams = (params: Record<string, any>, path: string) => {
    const urlParams = new URLSearchParams();
    if (!isLocal) {
        urlParams.append("path", path);
    }

    Object.entries(params).forEach(([key, value]) => urlParams.append(key, value))
    return urlParams;
}

export const fetchDiscoverMovies = async (query: string, page: number = 1) => {
    const response = await fetch(buildUrl('/search/multi', { "query": query, "page": page }), {
        method: 'GET',
        headers: defaultHeaders,
    });
    return response.json();
}

export const fetchMovieById = async (movieId: number | string): Promise<MovieDescription> => {
    const response = await fetch(buildUrl(`/movie/${movieId}`), {
        method: 'GET',
        headers: defaultHeaders,
    });
    return response.json();
}


export const fetchActorById = async (actorId: number | string): Promise<ActorDescription> => {
    const response = await fetch(buildUrl(`/person/${actorId}`), {
        method: 'GET',
        headers: defaultHeaders,
    });
    return response.json();
}

export const fetchMovieCreditsById = async (movieId: number | string): Promise<MovieCredits> => {
    const response = await fetch(buildUrl(`/movie/${movieId}/credits`), {
        method: 'GET',
        headers: defaultHeaders,
    });
    return response.json();
}

export const fetchActorCreditsById = async (actorId: number | string): Promise<ActorCredits> => {
    const response = await fetch(buildUrl(`/person/${actorId}/movie_credits`), {
        method: 'GET',
        headers: defaultHeaders,
    });
    return response.json();
}

export const fetchMovieBannerDiscover = async (genre?: string): Promise<MovieDiscover> => {
    const response = await fetch(buildUrl('/discover/movie', { 'genre': genre ?? 'action', 'page': '1', 'sort_by': 'popularity.desc' }), {
        method: 'GET',
        headers: defaultHeaders,
    });
    return response.json();
}