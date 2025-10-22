// src/components/MovieCardGrid.tsx
import React from "react";
import MovieCard from "~/components/MovieCard/MovieCard";
import type { Movie } from "~/types/Movie";

type Props = {
    movies: Movie[];
};
//Rename 
const MovieResultList: React.FC<Props> = ({ movies }) => {
    // Edit: Handle case when no movies are found
    if (!movies || movies.length === 0) {
        return (
            <div className="text-center text-gray-500 mt-10">
                No movies found. Try searching again.
            </div>
        );
    }
    //Change grid layout
    return (
        <div className="grid gap-6 p-4 grid-cols-1 ">
            {movies.map((movie) => (
                <MovieCard movie={movie} key={movie.id} />
            ))}
        </div>
    );
};

export default MovieResultList;
