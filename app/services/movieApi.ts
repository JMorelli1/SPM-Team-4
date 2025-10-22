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

export const fetchMovieById = async (movieId: number) => {
    const response = await fetch(`${apiBaseUrl}/movie/${movieId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`
        },
    });
    return response.json();
}

