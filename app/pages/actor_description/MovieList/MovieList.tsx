import { useNavigate } from "react-router";
import Poster from "~/components/Poster/Poster";
import { useActorCreditsById, useMovieCreditsById } from "~/hooks/MovieHooks";

const MovieList = ({ actorId }: { actorId: string }) => {

    const movieCreditsQuery = useActorCreditsById(actorId);
    const navigate = useNavigate();

    const navigateToDetails = (id: number) => {
        navigate(`/movie/${id}`);
    }

    return (
        <div className="cast-content">
            <h2 className="cast-title">Movies</h2>
            <div className="cast-list">
                {
                    movieCreditsQuery.data?.cast.map((movie) => (
                        <div key={movie.id} className="cast-card" onClick={() => navigateToDetails(movie.id)}>

                            <Poster path={movie?.poster_path} altText={movie.title} width={200} />

                            <div className="cast-info">
                                <span className="cast-name">{movie.title}</span>
                                <span className="cast-character">{movie.character}</span>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default MovieList;