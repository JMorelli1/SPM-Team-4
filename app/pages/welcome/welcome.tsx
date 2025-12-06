import { Alert, Box, CircularProgress, Pagination } from "@mui/material";
import React, { useEffect, useState } from "react";
import FavoriteList from "~/components/FavoriteList/FavoriteList";
import { useMovieDiscover } from "~/hooks/MovieHooks";
import type { Movie } from "~/types/Movie";
import MovieResultList from "./MovieResultList/MovieResultList";
import SearchBar from "./SearchBar/SearchBar";
import './welcome.scss';

export function Welcome() {
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState<Movie[] | null>(null);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [error, setError] = useState<string | null>(null);

  const movieDiscoverQuery = useMovieDiscover(searchQuery, page);

  useEffect(() => {
    if (movieDiscoverQuery.data) {
      setMovies(movieDiscoverQuery.data.results);
      setTotalPages(movieDiscoverQuery.data.total_pages);
    }
    if (movieDiscoverQuery.error) {
      setError("Failed to load movies.");
      setMovies(null);
      setTotalPages(1);
    }
  }, [movieDiscoverQuery.data, movieDiscoverQuery.error, movieDiscoverQuery.isSuccess]);

  const handleChange = (_: React.ChangeEvent<unknown>, value: number) => {
    if (value !== page) setPage(value); // triggers a new external call
  };

  const handleSearch = () => {
    setPage(1);
    setSearchQuery(query.trim());
  }

  return (
    <main className="welcome-page">
      <div className="welcome-page-content">
        <div style={{width: '97%'}}>
        <SearchBar query={query} setQuery={setQuery} onSearch={handleSearch} />
        </div>
        <div>
          {movieDiscoverQuery.isLoading || movieDiscoverQuery.isFetching ? (
            <Box className="flex justify-center py-10">
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <div className="movie-results-container">
              <MovieResultList movies={movies} />
            </div>
          )}

          {totalPages > 1 && <Box className="flex justify-center py-2">
            <Pagination
              count={totalPages}
              page={page}
              onChange={handleChange}
              color="primary"
              size="medium"
              showFirstButton
              showLastButton
            />
          </Box>}
        </div>

        <FavoriteList />
      </div>
    </main>
  );
}

