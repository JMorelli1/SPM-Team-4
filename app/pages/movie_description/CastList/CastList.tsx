import { useNavigate } from "react-router";
import Poster from "~/components/Poster/Poster";
import { useMovieCreditsById } from "~/hooks/MovieHooks";

const CastList = ({ movieId }: { movieId: string }) => {

    const movieCreditsQuery = useMovieCreditsById(movieId);
console.log('cast',movieCreditsQuery.data?.cast)

  const navigate = useNavigate();

  const navigateToDetails = (id: number) => {
    navigate(`/actor/${id}`);
  }
    return (
        <div className="cast-content">
            <h2 className="cast-title">Cast</h2>
            <div className="cast-list">
                {
                    movieCreditsQuery.data?.cast.map((castMember) => (
                        <div key={castMember.cast_id} className="cast-card" onClick={() => navigateToDetails(castMember.id)}>
                            <Poster path={castMember?.profile_path} altText={castMember.name} width={200} />

                            <div className="cast-info">
                                <span className="cast-name">{castMember.name}</span>
                                <span className="cast-character">{castMember.character}</span>
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default CastList;