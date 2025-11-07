export type MovieDescription = {
    id: string | number;
    budget: number;
    revenue: number;
    genres: Genre[];
    overview: string;
    poster_path: string;
    release_date: string;
    runtime: number;
    tagline: string;
    title: string;
    popularity: number;
    vote_average: number;
}

type Genre = {
    id: number;
    name: string;
}