import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import type { Movie } from "~/types/Movie";

type MovieCardProps = {
    movie: Movie
}
const MovieCard = ({ movie}: MovieCardProps) => {
    const navigate = useNavigate();
    
    return (
        <Card
                    key={movie.id}
                    onClick={() => {navigate(`/movie/${movie.id}`)}}
                    className="shadow-lg hover:shadow-xl transition-shadow duration-200 flex flex-row"
                >
                    <CardMedia //Does not render: must call to get images
                        component="img"
                        height="100"
                        image={`https://image.tmdb.org/t/p/w200/${movie.poster_path}`}
                        alt={movie.title}
                        className="object-cover w-32"
                    />
                    <CardContent className="flex flex-col">
                        <Typography
                            variant="h6"
                            component="h2"
                            className="font-semibold text-gray-800 mb-2 line-clamp-1"
                        >
                            {movie.title}
                        </Typography>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            className="line-clamp-3"
                        >
                            {movie.overview}
                        </Typography>
                    </CardContent>
                </Card>
    );
}

export default MovieCard;