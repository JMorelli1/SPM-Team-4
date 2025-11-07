import type { ActorCredits } from "~/types/ActorCredits";
import type { ActorDescription } from "~/types/ActorDescription";
import type { MovieCredits } from "~/types/MovieCredits";
import type { MovieDescription } from "~/types/MovieDescription";

const apiBaseUrl = '/api/movies';

export const fetchDiscoverMovies = async (query: string, page :number = 1) => {
    const response = await fetch(`${apiBaseUrl}/search/multi?query=${query}&page=${page}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`
        },
    });
    return response.json();
}

export const fetchMovieById = async (movieId: number | string): Promise<MovieDescription> => {
    const response = await fetch(`${apiBaseUrl}/movie/${movieId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`
        },
    });
    return response.json();
}

 
export const fetchActorById = async (actorId: number | string): Promise<ActorDescription> => {
    const response = await fetch(`${apiBaseUrl}/person/${actorId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`
        },
    });
    return response.json();
}

export const fetchMovieCreditsById = async (movieId: number | string): Promise<MovieCredits> => {
    const response = await fetch(`${apiBaseUrl}/movie/${movieId}/credits`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`
        },
    });
    return response.json();
}

export const fetchActorCreditsById = async (actorId: number | string): Promise<ActorCredits> => {
    const response = await fetch(`${apiBaseUrl}/person/${actorId}/movie_credits`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`
        },
    });
    return response.json();
}
