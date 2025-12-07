import { useNavigate } from "react-router";
import type { Movie } from "~/types/Movie";
import Poster from "../Poster/Poster";
import './MovieCard.scss';


type MovieCardProps = {
  movie: Movie
}
const MovieCard = ({ movie }: MovieCardProps) => {
  const navigate = useNavigate();
  const movieName = movie?.title ? movie.title : movie?.name;

  const navigateToDetails = () => {
    navigate(`/movie/${movie.id}`);
  }

  return (
    <div className="movie-card" data-testid="movie-card" onClick={navigateToDetails}>
      <Poster path={movie.poster_path} altText={movie.title} width={200} />
      <div className="movie-card__info">
        <h3 className="movie-card__title">{movieName}</h3>
      </div>
    </div>
  );
}

export default MovieCard;