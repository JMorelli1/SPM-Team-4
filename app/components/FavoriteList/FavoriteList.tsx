import { useNavigate } from "react-router";
import { useAppContext } from "~/AppContextProvider";
import Poster from "~/components/Poster/Poster";
import { useMovieByIds } from "~/hooks/MovieHooks";
import './FavoriteList.scss';

const FavoriteList = () => {
    const navigate = useNavigate();
    const { user } = useAppContext();
    const movieCreditsQuery = useMovieByIds(user?.favorites ? user.favorites.map(fav => fav.favoriteId) : []);
    const movieData = movieCreditsQuery.map(query => query.data).filter(data => data !== undefined);

    const navigateToDetails = (id: number) => {
        navigate(`/movie/${id}`);
    }

    return (
        <>
            {user &&
                <div className="favorite-content">
                    <h2 className="favorite-title">Favorites</h2>
                    <div className="favorite-list">
                        {
                            movieData.length > 0
                                ? movieData.map((movie) => (
                                    <div key={movie.id} className="favorite-card" onClick={() => navigateToDetails(movie.id as number)}>

                                        <Poster path={movie?.poster_path} altText={movie.title} width={200} />

                                        <div className="favorite-info">
                                            <span className="favorite-name">{movie.title}</span>
                                            {/* <span className="cast-character">{movie.character}</span> */}
                                        </div>
                                    </div>
                                ))
                                : <span>No favorites added yet.</span>
                        }
                    </div>
                </div>
            }
        </>
    );
}

export default FavoriteList;