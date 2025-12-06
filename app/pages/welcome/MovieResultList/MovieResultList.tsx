import React from "react";
import ActorCard from "~/components/ActorCard/ActorCard";
import MovieCard from "~/components/MovieCard/MovieCard";
import type { Movie } from "~/types/Movie";

type Props = {
    movies: Movie[] | null;
};


const MovieResultList: React.FC<Props> = ({ movies }) => {
    if (!movies) {
        return (
            <div className="text-center text-gray-500 mt-10">
                Search
            </div>
        );
    }
    if (movies.length === 0) {
        return (
            <div className="text-center text-gray-500 mt-10">
                No movies found. Try searching again.
            </div>
        );
    }


    const getCard = (movie: Movie) => {
        if (movie.media_type === "movie" || movie.media_type === "tv")
            return <MovieCard movie={movie} key={movie.id} />;
        if (movie.media_type === "person")
            return <ActorCard movie={movie} key={movie.id} />;
    }

    return (
        <div className="movie-results">
            {movies.map((movie) => getCard(movie))}
        </div>
    );
};

export default MovieResultList;
