import { useNavigate } from "react-router";
import type { Movie } from "~/types/Movie";
import Poster from "../Poster/Poster";
import './ActorCard.scss';

type ActorCardProps = {
  movie: Movie
}
const ActorCard = ({ movie }: ActorCardProps) => {
  const navigate = useNavigate();

  const navigateToDetails = () => {
    navigate(`/actor/${movie.id}`);
  }

  return (
    <div className="actor-card" data-testid="actor-card" onClick={navigateToDetails}>
      <Poster path={movie.profile_path} altText={movie.name} width={200} />

      <div className="actor-card__info">
        <h3 className="actor-card__title">{movie.name}</h3>
      </div>
    </div>
  );
}

export default ActorCard;