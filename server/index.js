import { jsx, jsxs, Fragment } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, UNSAFE_withComponentProps, Outlet, UNSAFE_withErrorBoundaryProps, isRouteErrorResponse, Meta, Links, ScrollRestoration, Scripts, useNavigate } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import TheaterComedyOutlinedIcon from "@mui/icons-material/TheaterComedyOutlined";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import React, { useState, useEffect } from "react";
import { Box, CircularProgress, Alert, Pagination, Typography as Typography$1 } from "@mui/material";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    let timeoutId = setTimeout(
      () => abort(),
      streamTimeout + 1e3
    );
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough({
            final(callback) {
              clearTimeout(timeoutId);
              timeoutId = void 0;
              callback();
            }
          });
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          pipe(body);
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = UNSAFE_withComponentProps(function App() {
  const queryClient = new QueryClient();
  return /* @__PURE__ */ jsx(QueryClientProvider, {
    client: queryClient,
    children: /* @__PURE__ */ jsx(Outlet, {})
  });
});
const ErrorBoundary = UNSAFE_withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
const apiBaseUrl = "/api/movies";
const defaultHeaders = {
  "Content-Type": "application/json",
  "Authorization": `Bearer ${void 0}`
};
const fetchDiscoverMovies = async (query, page = 1) => {
  const response = await fetch(`${apiBaseUrl}/search/multi?query=${query}&page=${page}`, {
    method: "GET",
    headers: defaultHeaders
  });
  return response.json();
};
const fetchMovieById = async (movieId) => {
  const response = await fetch(`${apiBaseUrl}/movie/${movieId}`, {
    method: "GET",
    headers: defaultHeaders
  });
  return response.json();
};
const fetchActorById = async (actorId) => {
  const response = await fetch(`${apiBaseUrl}/person/${actorId}`, {
    method: "GET",
    headers: defaultHeaders
  });
  return response.json();
};
const fetchMovieCreditsById = async (movieId) => {
  const response = await fetch(`${apiBaseUrl}/movie/${movieId}/credits`, {
    method: "GET",
    headers: defaultHeaders
  });
  return response.json();
};
const fetchActorCreditsById = async (actorId) => {
  const response = await fetch(`${apiBaseUrl}/person/${actorId}/movie_credits`, {
    method: "GET",
    headers: defaultHeaders
  });
  return response.json();
};
const fetchMovieBannerDiscover = async (genre) => {
  if (!genre) {
    genre = "action";
  }
  const params = new URLSearchParams();
  params.append("genre", genre);
  params.append("page", "1");
  params.append("sort_by", "popularity.desc");
  const response = await fetch(`${apiBaseUrl}/discover/movie?${params}`, {
    method: "GET",
    headers: defaultHeaders
  });
  return response.json();
};
const useMovieDiscover = (query, pageNumber) => {
  return useQuery(
    {
      queryKey: ["movieDiscover", query, pageNumber],
      queryFn: () => fetchDiscoverMovies(query, pageNumber),
      staleTime: 5 * 60 * 1e3,
      // 5 minutes
      enabled: !!query
    }
  );
};
const useMovieById = (movieId) => {
  return useQuery({
    queryKey: ["movieById", movieId],
    queryFn: () => fetchMovieById(movieId),
    staleTime: 10 * 60 * 1e3,
    // 10 minutes
    enabled: !!movieId
  });
};
const useActorById = (actorId) => {
  return useQuery({
    queryKey: ["actorById", actorId],
    queryFn: () => fetchActorById(actorId),
    staleTime: 10 * 60 * 1e3,
    // 10 minutes
    enabled: !!actorId
  });
};
const useMovieCreditsById = (movieId) => {
  return useQuery({
    queryKey: ["movieCreditsById", movieId],
    queryFn: () => fetchMovieCreditsById(movieId),
    staleTime: 10 * 60 * 1e3,
    // 10 minutes
    enabled: !!movieId
  });
};
const useActorCreditsById = (actorId) => {
  return useQuery({
    queryKey: ["actorCreditsById", actorId],
    queryFn: () => fetchActorCreditsById(actorId),
    staleTime: 10 * 60 * 1e3,
    // 10 minutes
    enabled: !!actorId
  });
};
const useMovieBannerDiscover = (genre) => {
  return useQuery({
    queryKey: ["movieDiscover", genre],
    queryFn: () => fetchMovieBannerDiscover(genre),
    staleTime: 10 * 60 * 1e3,
    // 10 minutes
    enabled: true
  });
};
const Header = () => {
  const navigate = useNavigate();
  const movieBannerQuery = useMovieBannerDiscover();
  const [index, setIndex] = useState(0);
  const [currentBannerId, setCurrentBannerId] = useState();
  const [currentImage, setCurrentImage] = useState("");
  const [nextImage, setNextImage] = useState(null);
  const [currentTitle, setCurrentTitle] = useState("");
  const [nextTitle, setNextTitle] = useState("");
  const [titlePhase, setTitlePhase] = useState("idle");
  const imageUrlBasePath = `https://image.tmdb.org/t/p/w500/`;
  useEffect(() => {
    var _a;
    if (movieBannerQuery.data && ((_a = movieBannerQuery.data) == null ? void 0 : _a.results.length) > 0) {
      const images = movieBannerQuery.data.results.map((x) => ({ url: `${imageUrlBasePath}${x.backdrop_path}`, title: x.title, id: x.id }));
      if (currentImage === "") {
        setCurrentImage(images[0].url);
        setCurrentTitle(images[0].title);
        setCurrentBannerId(images[0].id);
      }
      const interval = setInterval(() => {
        const newIndex = (index + 1) % images.length;
        const newImage = images[newIndex];
        setNextImage(newImage.url);
        setNextTitle(newImage.title);
        setTitlePhase("in");
        setTimeout(() => {
          setCurrentBannerId(newImage.id);
          setCurrentImage(newImage.url);
          setCurrentTitle(newImage.title);
          setNextImage(null);
          setTitlePhase("idle");
        }, 1e3);
        setIndex(newIndex);
      }, 2e4);
      return () => clearInterval(interval);
    }
  }, [movieBannerQuery.data, currentImage]);
  const handleLogoClick = () => {
    navigate("/");
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "header",
      children: [
        /* @__PURE__ */ jsx("div", { className: "banner-layer current", style: { ["--banner-image"]: `url(${currentImage})` } }),
        nextImage && /* @__PURE__ */ jsx("div", { className: "banner-layer next", style: { ["--banner-image"]: `url(${nextImage})` } }),
        /* @__PURE__ */ jsx("div", { className: `title-layer ${titlePhase === "in" ? "exit" : ""}`, children: /* @__PURE__ */ jsx("span", { className: "title-text", onClick: () => navigate(`/movie/${currentBannerId}`), children: currentTitle }) }),
        nextTitle && /* @__PURE__ */ jsx("div", { className: `title-layer ${titlePhase === "in" ? "enter" : ""}`, children: /* @__PURE__ */ jsx("span", { className: "title-text", children: nextTitle }) }),
        /* @__PURE__ */ jsx("div", { className: "header_content", children: /* @__PURE__ */ jsx(Toolbar, { className: "header_content__toolbar", children: /* @__PURE__ */ jsxs(
          "div",
          {
            className: "header_content__logo",
            onClick: handleLogoClick,
            children: [
              /* @__PURE__ */ jsx(TheaterComedyOutlinedIcon, { fontSize: "large" }),
              /* @__PURE__ */ jsx(Typography, { variant: "h6", component: "div", className: "header_content__title", children: "Reel Time" })
            ]
          }
        ) }) })
      ]
    }
  );
};
function AppLayout() {
  return /* @__PURE__ */ jsxs("div", {
    className: "app",
    children: [/* @__PURE__ */ jsx(Header, {}), /* @__PURE__ */ jsx("div", {
      className: "app-content",
      children: /* @__PURE__ */ jsx(Outlet, {})
    })]
  });
}
const AppLayout$1 = UNSAFE_withComponentProps(AppLayout);
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  AppLayout,
  default: AppLayout$1
}, Symbol.toStringTag, { value: "Module" }));
const noImage = "data:image/svg+xml,%3csvg%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20version='1.1'%20width='256'%20height='256'%20viewBox='0%200%20256%20256'%20xml:space='preserve'%3e%3cg%20style='stroke:%20none;%20stroke-width:%200;%20stroke-dasharray:%20none;%20stroke-linecap:%20butt;%20stroke-linejoin:%20miter;%20stroke-miterlimit:%2010;%20fill:%20none;%20fill-rule:%20nonzero;%20opacity:%201;'%20transform='translate(1.4065934065934016%201.4065934065934016)%20scale(2.81%202.81)'%3e%3cpath%20d='M%2074.453%2048.627%20c%20-5.538%200%20-11.075%20-2.107%20-15.291%20-6.324%20c%20-6.11%20-6.11%20-7.768%20-14.99%20-5.024%20-22.629%20H%2025.502%20H%206.058%20C%202.712%2019.675%200%2022.387%200%2025.733%20v%2016.322%20L%2023.834%2062.37%20c%202.278%201.942%205.573%202.119%208.047%200.434%20l%2014.382%20-9.801%20c%202.33%20-1.588%205.408%20-1.531%207.677%200.141%20l%2027.15%2020.001%20V%2047.865%20v%20-0.294%20C%2078.934%2048.263%2076.696%2048.627%2074.453%2048.627%20z'%20style='stroke:%20none;%20stroke-width:%201;%20stroke-dasharray:%20none;%20stroke-linecap:%20butt;%20stroke-linejoin:%20miter;%20stroke-miterlimit:%2010;%20fill:%20rgb(193,229,244);%20fill-rule:%20nonzero;%20opacity:%201;'%20transform='%20matrix(1%200%200%201%200%200)%20'%20stroke-linecap='round'/%3e%3ccircle%20cx='27.942'%20cy='37.942'%20r='6.072'%20style='stroke:%20none;%20stroke-width:%201;%20stroke-dasharray:%20none;%20stroke-linecap:%20butt;%20stroke-linejoin:%20miter;%20stroke-miterlimit:%2010;%20fill:%20rgb(255,240,169);%20fill-rule:%20nonzero;%20opacity:%201;'%20transform='%20matrix(1%200%200%201%200%200)%20'/%3e%3cpath%20d='M%2085.446%2016.02%20c%20-6.061%20-6.061%20-15.922%20-6.061%20-21.983%200%20s%20-6.061%2015.923%200%2021.984%20c%203.031%203.031%207.011%204.546%2010.992%204.546%20c%203.98%200%207.962%20-1.515%2010.992%20-4.545%20C%2088.383%2035.068%2090%2031.164%2090%2027.012%20C%2090%2022.86%2088.383%2018.956%2085.446%2016.02%20z%20M%2081.891%2019.575%20c%201.987%201.986%203.081%204.627%203.081%207.436%20c%200%201.95%20-0.538%203.813%20-1.525%205.438%20L%2069.019%2018.021%20C%2073.062%2015.579%2078.403%2016.087%2081.891%2019.575%20z%20M%2067.018%2034.449%20c%20-3.486%20-3.487%20-3.997%20-8.829%20-1.554%20-12.873%20L%2079.89%2036.003%20C%2075.847%2038.446%2070.505%2037.935%2067.018%2034.449%20z'%20style='stroke:%20none;%20stroke-width:%201;%20stroke-dasharray:%20none;%20stroke-linecap:%20butt;%20stroke-linejoin:%20miter;%20stroke-miterlimit:%2010;%20fill:%20rgb(226,147,147);%20fill-rule:%20nonzero;%20opacity:%201;'%20transform='%20matrix(1%200%200%201%200%200)%20'%20stroke-linecap='round'/%3e%3cpath%20d='M%200%2040.043%20v%2032.425%20c%200%203.346%202.712%206.058%206.058%206.058%20h%2068.974%20c%203.346%200%206.058%20-2.712%206.058%20-6.058%20v%20-1.335%20L%2053.94%2051.132%20c%20-2.27%20-1.672%20-5.348%20-1.729%20-7.677%20-0.141%20L%2031.88%2060.792%20c%20-2.473%201.686%20-5.769%201.508%20-8.047%20-0.434%20L%200%2040.043%20z'%20style='stroke:%20none;%20stroke-width:%201;%20stroke-dasharray:%20none;%20stroke-linecap:%20butt;%20stroke-linejoin:%20miter;%20stroke-miterlimit:%2010;%20fill:%20rgb(150,234,156);%20fill-rule:%20nonzero;%20opacity:%201;'%20transform='%20matrix(1%200%200%201%200%200)%20'%20stroke-linecap='round'/%3e%3c/g%3e%3c/svg%3e";
const Poster = ({ path, altText, width = 200 }) => {
  return /* @__PURE__ */ jsx(Fragment, { children: path ? /* @__PURE__ */ jsx(
    "img",
    {
      src: `https://image.tmdb.org/t/p/w${width}/${path}`,
      alt: altText || "Poster"
    }
  ) : /* @__PURE__ */ jsx(
    "img",
    {
      src: noImage,
      alt: "No Image Found"
    }
  ) });
};
const ActorCard = ({ movie }) => {
  const navigate = useNavigate();
  const navigateToDetails = () => {
    navigate(`/actor/${movie.id}`);
  };
  return /* @__PURE__ */ jsxs("div", { className: "actor-card", onClick: navigateToDetails, children: [
    /* @__PURE__ */ jsx(Poster, { path: movie.profile_path, altText: movie.name, width: 200 }),
    /* @__PURE__ */ jsx("div", { className: "actor-card__info", children: /* @__PURE__ */ jsx("h3", { className: "actor-card__title", children: movie.name }) })
  ] });
};
const MovieCard = ({ movie }) => {
  const navigate = useNavigate();
  const movieName = (movie == null ? void 0 : movie.title) ? movie.title : movie == null ? void 0 : movie.name;
  const navigateToDetails = () => {
    navigate(`/movie/${movie.id}`);
  };
  return /* @__PURE__ */ jsxs("div", { className: "movie-card", onClick: navigateToDetails, children: [
    /* @__PURE__ */ jsx(Poster, { path: movie.poster_path, altText: movie.title, width: 200 }),
    /* @__PURE__ */ jsx("div", { className: "movie-card__info", children: /* @__PURE__ */ jsx("h3", { className: "movie-card__title", children: movieName }) })
  ] });
};
const MovieResultList = ({ movies }) => {
  console.log(movies);
  if (!movies) {
    return /* @__PURE__ */ jsx("div", { className: "text-center text-gray-500 mt-10", children: "Search" });
  }
  if (movies.length === 0) {
    return /* @__PURE__ */ jsx("div", { className: "text-center text-gray-500 mt-10", children: "No movies found. Try searching again." });
  }
  const getCard = (movie) => {
    if (movie.media_type === "movie" || movie.media_type === "tv")
      return /* @__PURE__ */ jsx(MovieCard, { movie }, movie.id);
    if (movie.media_type === "person")
      return /* @__PURE__ */ jsx(ActorCard, { movie }, movie.id);
  };
  return /* @__PURE__ */ jsx("div", { className: "movie-results", children: movies.map((movie) => getCard(movie)) });
};
const SearchBar = ({ query, setQuery, onSearch }) => {
  const [loading, setLoading] = React.useState(false);
  const submit = async (e) => {
    e == null ? void 0 : e.preventDefault();
    try {
      setLoading(true);
      console.log("Searching for:", query);
      await onSearch();
    } finally {
      setLoading(false);
    }
  };
  const clear = () => setQuery("");
  return /* @__PURE__ */ jsx("form", { onSubmit: submit, className: "search-bar", children: /* @__PURE__ */ jsx(
    TextField,
    {
      value: query,
      onChange: (e) => setQuery(e.target.value),
      placeholder: "Search movies, actors, genres…",
      size: "small",
      fullWidth: true,
      slotProps: {
        input: {
          endAdornment: /* @__PURE__ */ jsxs(InputAdornment, { position: "end", children: [
            query ? /* @__PURE__ */ jsx(IconButton, { "aria-label": "Clear search", edge: "end", onClick: clear, children: /* @__PURE__ */ jsx(ClearIcon, {}) }) : null,
            /* @__PURE__ */ jsx(
              IconButton,
              {
                "aria-label": "Search",
                edge: "end",
                onClick: () => submit(),
                disabled: !query.trim() || loading,
                children: /* @__PURE__ */ jsx(SearchIcon, {})
              }
            )
          ] })
        }
      },
      inputProps: { "aria-label": "Search" }
    }
  ) });
};
function Welcome() {
  const [query, setQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState(null);
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
  const handleChange = (_, value) => {
    if (value !== page) setPage(value);
  };
  const handleSearch = () => {
    setPage(1);
    setSearchQuery(query.trim());
  };
  return /* @__PURE__ */ jsx("main", { className: "welcome-page", children: /* @__PURE__ */ jsxs("div", { className: "welcome-page-content", children: [
    /* @__PURE__ */ jsx(SearchBar, { query, setQuery, onSearch: handleSearch }),
    /* @__PURE__ */ jsxs("div", { children: [
      movieDiscoverQuery.isLoading || movieDiscoverQuery.isFetching ? /* @__PURE__ */ jsx(Box, { className: "flex justify-center py-10", children: /* @__PURE__ */ jsx(CircularProgress, {}) }) : error ? /* @__PURE__ */ jsx(Alert, { severity: "error", children: error }) : /* @__PURE__ */ jsx("div", { className: "movie-results-container", children: /* @__PURE__ */ jsx(MovieResultList, { movies }) }),
      totalPages > 1 && /* @__PURE__ */ jsx(Box, { className: "flex justify-center py-2", children: /* @__PURE__ */ jsx(
        Pagination,
        {
          count: totalPages,
          page,
          onChange: handleChange,
          color: "primary",
          size: "medium",
          showFirstButton: true,
          showLastButton: true
        }
      ) })
    ] })
  ] }) });
}
function meta$2({}) {
  return [{
    title: "Reel Time App"
  }, {
    name: "description",
    content: "Welcome to Reel Time!"
  }];
}
const home = UNSAFE_withComponentProps(function Home() {
  return /* @__PURE__ */ jsx(Welcome, {});
});
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta: meta$2
}, Symbol.toStringTag, { value: "Module" }));
const CastList = ({ movieId }) => {
  var _a, _b;
  const movieCreditsQuery = useMovieCreditsById(movieId);
  console.log("cast", (_a = movieCreditsQuery.data) == null ? void 0 : _a.cast);
  const navigate = useNavigate();
  const navigateToDetails = (id) => {
    navigate(`/actor/${id}`);
  };
  return /* @__PURE__ */ jsxs("div", { className: "cast-content", children: [
    /* @__PURE__ */ jsx("h2", { className: "cast-title", children: "Cast" }),
    /* @__PURE__ */ jsx("div", { className: "cast-list", children: (_b = movieCreditsQuery.data) == null ? void 0 : _b.cast.map((castMember) => /* @__PURE__ */ jsxs("div", { className: "cast-card", onClick: () => navigateToDetails(castMember.id), children: [
      /* @__PURE__ */ jsx(Poster, { path: castMember == null ? void 0 : castMember.profile_path, altText: castMember.name, width: 200 }),
      /* @__PURE__ */ jsxs("div", { className: "cast-info", children: [
        /* @__PURE__ */ jsx("span", { className: "cast-name", children: castMember.name }),
        /* @__PURE__ */ jsx("span", { className: "cast-character", children: castMember.character })
      ] })
    ] }, castMember.cast_id)) })
  ] });
};
const CircularProgressWithLabel = (props) => {
  return /* @__PURE__ */ jsxs(Box, { sx: { position: "relative", display: "inline-flex" }, children: [
    /* @__PURE__ */ jsx(CircularProgress, { style: { color: "green" }, variant: "determinate", ...props }),
    /* @__PURE__ */ jsx(
      Box,
      {
        sx: {
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        },
        children: /* @__PURE__ */ jsx(
          Typography$1,
          {
            variant: "caption",
            component: "div",
            sx: { color: "black" },
            children: `${Math.round(props.value)}%`
          }
        )
      }
    )
  ] });
};
const MovieDescription = ({ movieId }) => {
  var _a, _b, _c, _d, _e, _f, _g, _h, _i;
  const movieQuery = useMovieById(movieId);
  const getRuntimeString = (runtime) => {
    if (!runtime) return "";
    const hours = Math.floor(runtime / 60);
    const minutes = runtime % 60;
    return `${hours}h ${minutes}m`;
  };
  const getRelaseDateString = (releaseDate) => {
    if (!releaseDate) return "";
    const date = new Date(releaseDate);
    return date.toLocaleDateString(void 0, { year: "numeric", month: "long", day: "numeric" });
  };
  return /* @__PURE__ */ jsxs("div", { className: "movie-description-content", children: [
    /* @__PURE__ */ jsxs("div", { className: "banner", children: [
      /* @__PURE__ */ jsx(Poster, { path: (_a = movieQuery.data) == null ? void 0 : _a.poster_path, altText: (_b = movieQuery.data) == null ? void 0 : _b.title, width: 200 }),
      /* @__PURE__ */ jsxs("div", { className: "banner-info", children: [
        /* @__PURE__ */ jsxs("div", { className: "banner-title", children: [
          /* @__PURE__ */ jsxs("h1", { children: [
            (_c = movieQuery.data) == null ? void 0 : _c.title,
            " ",
            /* @__PURE__ */ jsx(CircularProgressWithLabel, { value: ((_d = movieQuery.data) == null ? void 0 : _d.vote_average) * 10 })
          ] }),
          /* @__PURE__ */ jsxs("h3", { children: [
            getRelaseDateString((_e = movieQuery.data) == null ? void 0 : _e.release_date),
            " • ",
            (_f = movieQuery.data) == null ? void 0 : _f.genres.map((genre) => genre.name).join(", "),
            " • ",
            getRuntimeString((_g = movieQuery.data) == null ? void 0 : _g.runtime)
          ] })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "banner-tagline", children: (_h = movieQuery.data) == null ? void 0 : _h.tagline }),
        /* @__PURE__ */ jsxs("label", { className: "banner-overview", children: [
          "Overview",
          /* @__PURE__ */ jsx("p", { children: (_i = movieQuery.data) == null ? void 0 : _i.overview })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(CastList, { movieId })
  ] });
};
function meta$1({}) {
  return [{
    title: "Reel Time App"
  }, {
    name: "description",
    content: "Welcome to Reel Time!"
  }];
}
const movieDescription = UNSAFE_withComponentProps(function MovieDescriptionRoute({
  params
}) {
  return /* @__PURE__ */ jsx(MovieDescription, {
    movieId: params.movieId
  });
});
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: movieDescription,
  meta: meta$1
}, Symbol.toStringTag, { value: "Module" }));
const MovieList = ({ actorId }) => {
  var _a, _b;
  const movieCreditsQuery = useActorCreditsById(actorId);
  console.log("cast", (_a = movieCreditsQuery.data) == null ? void 0 : _a.cast);
  const navigate = useNavigate();
  const navigateToDetails = (id) => {
    navigate(`/movie/${id}`);
  };
  return /* @__PURE__ */ jsxs("div", { className: "cast-content", children: [
    /* @__PURE__ */ jsx("h2", { className: "cast-title", children: "Movies" }),
    /* @__PURE__ */ jsx("div", { className: "cast-list", children: (_b = movieCreditsQuery.data) == null ? void 0 : _b.cast.map((movie) => /* @__PURE__ */ jsxs("div", { className: "cast-card", onClick: () => navigateToDetails(movie.id), children: [
      /* @__PURE__ */ jsx(Poster, { path: movie == null ? void 0 : movie.poster_path, altText: movie.title, width: 200 }),
      /* @__PURE__ */ jsxs("div", { className: "cast-info", children: [
        /* @__PURE__ */ jsx("span", { className: "cast-name", children: movie.title }),
        /* @__PURE__ */ jsx("span", { className: "cast-character", children: movie.character })
      ] })
    ] }, movie.id)) })
  ] });
};
const ActorDescription = ({ actorId }) => {
  var _a, _b, _c, _d, _e;
  const actorQuery = useActorById(actorId);
  return /* @__PURE__ */ jsxs("div", { className: "actor-description-content", children: [
    /* @__PURE__ */ jsxs("div", { className: "banner", children: [
      /* @__PURE__ */ jsx(Poster, { path: (_a = actorQuery.data) == null ? void 0 : _a.profile_path, altText: (_b = actorQuery.data) == null ? void 0 : _b.name, width: 200 }),
      /* @__PURE__ */ jsxs("div", { className: "banner-info", children: [
        /* @__PURE__ */ jsx("div", { className: "banner-title", children: /* @__PURE__ */ jsxs("h1", { children: [
          (_c = actorQuery.data) == null ? void 0 : _c.name,
          " ",
          /* @__PURE__ */ jsx(CircularProgressWithLabel, { value: ((_d = actorQuery.data) == null ? void 0 : _d.popularity) * 10 })
        ] }) }),
        /* @__PURE__ */ jsxs("label", { className: "banner-overview", children: [
          "Biography",
          /* @__PURE__ */ jsx("p", { children: (_e = actorQuery.data) == null ? void 0 : _e.biography })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx(MovieList, { actorId })
  ] });
};
function meta({}) {
  return [{
    title: "Reel Time App"
  }, {
    name: "description",
    content: "Welcome to Reel Time!"
  }];
}
const actorDescription = UNSAFE_withComponentProps(function ActorDescriptionRoute({
  params
}) {
  return /* @__PURE__ */ jsx(ActorDescription, {
    actorId: params.actorId
  });
});
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: actorDescription,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/SPM-Team-4/assets/entry.client-Cbz2FLJv.js", "imports": ["/SPM-Team-4/assets/chunk-OIYGIGL5-B3yLpFXF.js", "/SPM-Team-4/assets/index-B4KOOjUr.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/SPM-Team-4/assets/root-fNagPpTp.js", "imports": ["/SPM-Team-4/assets/chunk-OIYGIGL5-B3yLpFXF.js", "/SPM-Team-4/assets/index-B4KOOjUr.js", "/SPM-Team-4/assets/QueryClientProvider-Dj6owd9g.js"], "css": ["/SPM-Team-4/assets/root-CAhPB6wp.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "components/layout/AppLayout": { "id": "components/layout/AppLayout", "parentId": "root", "path": void 0, "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/SPM-Team-4/assets/AppLayout-1pcndppp.js", "imports": ["/SPM-Team-4/assets/chunk-OIYGIGL5-B3yLpFXF.js", "/SPM-Team-4/assets/createSvgIcon-Dhz5D95Y.js", "/SPM-Team-4/assets/MovieHooks-Cp2FWWVD.js", "/SPM-Team-4/assets/QueryClientProvider-Dj6owd9g.js"], "css": ["/SPM-Team-4/assets/AppLayout-D8Dg1Tpv.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "components/layout/AppLayout", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/SPM-Team-4/assets/home-BAhm6Hzs.js", "imports": ["/SPM-Team-4/assets/chunk-OIYGIGL5-B3yLpFXF.js", "/SPM-Team-4/assets/MovieHooks-Cp2FWWVD.js", "/SPM-Team-4/assets/Poster-Dq_HHLio.js", "/SPM-Team-4/assets/createSvgIcon-Dhz5D95Y.js", "/SPM-Team-4/assets/index-B4KOOjUr.js", "/SPM-Team-4/assets/QueryClientProvider-Dj6owd9g.js"], "css": ["/SPM-Team-4/assets/home-CdZpn9K2.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/movieDescription": { "id": "routes/movieDescription", "parentId": "components/layout/AppLayout", "path": "movie/:movieId", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/SPM-Team-4/assets/movieDescription-D_BmSBpo.js", "imports": ["/SPM-Team-4/assets/chunk-OIYGIGL5-B3yLpFXF.js", "/SPM-Team-4/assets/MovieHooks-Cp2FWWVD.js", "/SPM-Team-4/assets/Poster-Dq_HHLio.js", "/SPM-Team-4/assets/CircularProgressWithLabel-Ru1vIEkF.js", "/SPM-Team-4/assets/QueryClientProvider-Dj6owd9g.js"], "css": ["/SPM-Team-4/assets/movieDescription-DaD3n4s5.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/actorDescription": { "id": "routes/actorDescription", "parentId": "components/layout/AppLayout", "path": "actor/:actorId", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/SPM-Team-4/assets/actorDescription-DKbMJ4DM.js", "imports": ["/SPM-Team-4/assets/chunk-OIYGIGL5-B3yLpFXF.js", "/SPM-Team-4/assets/MovieHooks-Cp2FWWVD.js", "/SPM-Team-4/assets/Poster-Dq_HHLio.js", "/SPM-Team-4/assets/CircularProgressWithLabel-Ru1vIEkF.js", "/SPM-Team-4/assets/QueryClientProvider-Dj6owd9g.js"], "css": ["/SPM-Team-4/assets/actorDescription-Btb06Tlw.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/SPM-Team-4/assets/manifest-cf0a176b.js", "version": "cf0a176b", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v8_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const routeDiscovery = { "mode": "lazy", "manifestPath": "/__manifest" };
const publicPath = "/SPM-Team-4/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "components/layout/AppLayout": {
    id: "components/layout/AppLayout",
    parentId: "root",
    path: void 0,
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/home": {
    id: "routes/home",
    parentId: "components/layout/AppLayout",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route2
  },
  "routes/movieDescription": {
    id: "routes/movieDescription",
    parentId: "components/layout/AppLayout",
    path: "movie/:movieId",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/actorDescription": {
    id: "routes/actorDescription",
    parentId: "components/layout/AppLayout",
    path: "actor/:actorId",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routeDiscovery,
  routes,
  ssr
};
