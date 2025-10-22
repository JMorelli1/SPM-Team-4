import { Button } from "@mui/material";
import { fetchDiscoverMovies } from "~/services/movieApi";
import SearchBar from "./SearchBar/SearchBar";
import { Pagination, CircularProgress, Alert, Box } from "@mui/material";
import MovieResultList from "./MovieResultList/MovieResultList";
import React, { useEffect, useState } from "react";
import type { Movie } from "~/types/Movie";
import Header from "~/components/Header/Header";
import { useNavigate } from "react-router";
import { useMovieDiscover } from "~/hooks/MovieHooks";

export function Welcome() {
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const movieDiscoverQuery = useMovieDiscover(searchQuery, page);

  useEffect(() => {
    if (movieDiscoverQuery.data) {
      setMovies(movieDiscoverQuery.data.results);
      setTotalPages(movieDiscoverQuery.data.total_pages);
    }
    if (movieDiscoverQuery.error) {
      setError("Failed to load movies.");
      setMovies([]);
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
    <main className="flex items-center justify-center">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <Header />
        <div className="max-w-[600px] w-full space-y-6 px-4">
          <SearchBar query={query} setQuery={setQuery} onSearch={handleSearch} />
          <div className={`flex flex-col gap-4`}>
            {loading ? (
              <Box className="flex justify-center py-10">
                <CircularProgress />
              </Box>
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : (
              <MovieResultList movies={movies} />
            )}

            <Box className="flex justify-center py-2">
              <Pagination
                count={totalPages}
                page={page}
                onChange={handleChange}
                color="primary"
                size="medium"
                showFirstButton
                showLastButton
              />
            </Box>
          </div>
        </div>
      </div>
    </main>
  );
}

