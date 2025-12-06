import TheaterComedyOutlinedIcon from '@mui/icons-material/TheaterComedyOutlined';
import {
    Alert,
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from 'react-router';
import { useAppContext } from '~/AppContextProvider';
import { useLoginMutation } from "~/hooks/LoginHooks";

export default function Login() {
    const { setUser } = useAppContext();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const loginMutation = useLoginMutation();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            username,
            password
        };

        loginMutation.mutate(payload, {
            onSuccess: (data) => {
                setUser(data.user);
                navigate('/');
            },
            onError: (error: any) => {
                console.error("Login failed:", error);
                setErrorMessage("Login failed. Please try again.");
            }
        });
    };

    return (
        <Container maxWidth="xs">
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    mt: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
            >
                <TheaterComedyOutlinedIcon style={{ fontSize: "120px" }} />

                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1px", marginTop: "16px" }}>
                    <Typography component="h1" variant="h4">
                        Reel Time
                    </Typography>
                    <Typography component="h3" style={{ fontStyle: 'italic', opacity: 0.7 }}>
                        Sign in to your account
                    </Typography>
                </div>

                {/* Error alert */}
                {errorMessage && (
                    <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                        {errorMessage}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: "100%" }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        type="password"
                        label="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2 }}
                    >
                        Sign In
                    </Button>
                    <Button
                        type="button"
                        onClick={() => navigate('/register')}
                        fullWidth
                        variant="outlined"
                        sx={{ mt: 1 }}
                    >
                        Register
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}
