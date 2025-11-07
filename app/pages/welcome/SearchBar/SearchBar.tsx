import React from "react";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import ClearIcon from "@mui/icons-material/Clear";
import SearchIcon from "@mui/icons-material/Search";

type Props = {
    query: string;
    setQuery: (query: string) => void;
    onSearch: () => Promise<void> | void;
};

const SearchBar: React.FC<Props> = ({ query, setQuery, onSearch }) => {
    const [loading, setLoading] = React.useState(false);

    const submit = async (e?: React.FormEvent) => {
        e?.preventDefault();
        // const q = query.trim();
        // if (!q || loading) return;
        try {
            setLoading(true);
            console.log("Searching for:", query);
            await onSearch();
        } finally {
            setLoading(false);
        }
    };

    const clear = () => setQuery("");

    return (
        <form onSubmit={submit} className="search-bar">
            <TextField
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={"Search movies, actors, genres…"}
                size="small"
                fullWidth
                slotProps={{
                    input: {
                        endAdornment: (
                            <InputAdornment position="end">
                                {query ? (
                                    <IconButton aria-label="Clear search" edge="end" onClick={clear}>
                                        <ClearIcon />
                                    </IconButton>
                                ) : null}
                                <IconButton
                                    aria-label="Search"
                                    edge="end"
                                    onClick={() => submit()}
                                    disabled={!query.trim() || loading}
                                >
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        ),
                    },
                }}

                inputProps={{ "aria-label": "Search" }} //?
            />
        </form>
    );
};

export default SearchBar;
