import { useActorById, useMovieById } from "~/hooks/MovieHooks";
import './ActorDescription.scss';
import MovieList from "./MovieList/MovieList";
import CircularProgressWithLabel from "~/components/CircularProgressWithLabel/CircularProgressWithLabel";
import Poster from "~/components/Poster/Poster";

const ActorDescription = ({ actorId }: { actorId: string }) => {

    const actorQuery = useActorById(actorId);

    return (
        <div className="actor-description-content">
            <div className="banner">
                <Poster path={actorQuery.data?.profile_path} altText={actorQuery.data?.name} width={200} />

                <div className="banner-info">
                    <div className="banner-title">
                        <h1>{actorQuery.data?.name} <CircularProgressWithLabel value={actorQuery.data?.popularity as number * 10} /></h1>
                        {/* <h3>{getRelaseDateString(movieQuery.data?.release_date)} &#8226; {movieQuery.data?.genres.map(genre => genre.name).join(', ')} &#8226; {getRuntimeString(movieQuery.data?.runtime)}</h3> */}
                    </div>
                    {/* <span className="banner-tagline">{movieQuery.data?.tagline}</span> */}
                    <label className="banner-overview">Biography
                        <p>{actorQuery.data?.biography}</p>
                    </label>
                </div>
            </div>
            <MovieList actorId={actorId} />
        </div>
    );
}
export default ActorDescription;