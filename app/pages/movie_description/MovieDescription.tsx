import { useMovieById } from "~/hooks/MovieHooks";
import './MovieDescription.scss';
import CastList from "./CastList/CastList";
import CircularProgressWithLabel from "~/components/CircularProgressWithLabel/CircularProgressWithLabel";
import Poster from "~/components/Poster/Poster";

const MovieDescription = ({ movieId }: { movieId: string }) => {

    const movieQuery = useMovieById(movieId);

    const getRuntimeString = (runtime: number | undefined) => {
        if (!runtime) return '';
        const hours = Math.floor(runtime / 60);
        const minutes = runtime % 60;
        return `${hours}h ${minutes}m`;
    }

    const getRelaseDateString = (releaseDate: string | undefined) => {
        if (!releaseDate) return '';
        const date = new Date(releaseDate);
        return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    }

    return (
        <div className="movie-description-content">
            <div className="banner">
        
                <Poster path={movieQuery.data?.poster_path} altText={movieQuery.data?.title} width={200} />

                <div className="banner-info">
                    <div className="banner-title">
                        <h1>{movieQuery.data?.title} <CircularProgressWithLabel value={movieQuery.data?.vote_average as number * 10} /></h1>
                        <h3>{getRelaseDateString(movieQuery.data?.release_date)} &#8226; {movieQuery.data?.genres.map(genre => genre.name).join(', ')} &#8226; {getRuntimeString(movieQuery.data?.runtime)}</h3>
                    </div>
                    <span className="banner-tagline">{movieQuery.data?.tagline}</span>
                    <label className="banner-overview">Overview
                        <p>{movieQuery.data?.overview}</p>
                    </label>
                </div>
            </div>
            <CastList movieId={movieId} />
        </div>
    );
}
export default MovieDescription;