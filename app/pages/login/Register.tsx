import React, { useState } from "react";
import {
    Box,
    Button,
    Container,
    Paper,
    TextField,
    Typography,
    Alert
} from "@mui/material";
import { useLoginRegistrationMutation } from "~/hooks/LoginHooks";

export default function Register() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        phone: ""
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const userRegistrationMutation = useLoginRegistrationMutation();

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage("");
        setSuccessMessage("");

        if (!formData.username || !formData.password) {
            setErrorMessage("Username and Password are required.");
            return;
        }

        userRegistrationMutation.mutate(formData, {
            onSuccess: (data) => {
                setSuccessMessage("Registration successful! You can now sign in.");
                // clear form
                setFormData({
                    username: "",
                    password: "",
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: ""
                });
            },
            onError: (error: any) => {
                console.error("Registration failed:", error);
                setErrorMessage("Registration failed. Please try again.");
            }
        })
    };

    return (
        <Container maxWidth="sm">
            <Paper
                elevation={3}
                sx={{
                    p: 4,
                    mt: 8,
                    mb: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center"
                }}
            >
                <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
                    Create Account
                </Typography>

                {/* Error message */}
                {errorMessage && (
                    <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                        {errorMessage}
                    </Alert>
                )}

                {/* Success message */}
                {successMessage && (
                    <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
                        {successMessage}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ width: "100%" }}>
                    <TextField
                        label="Username"
                        required
                        fullWidth
                        sx={{ mb: 2 }}
                        value={formData.username}
                        onChange={(e) => handleChange("username", e.target.value)}
                    />

                    <TextField
                        label="Password"
                        required
                        type="password"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={formData.password}
                        onChange={(e) => handleChange("password", e.target.value)}
                    />

                    <TextField
                        label="First Name"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={formData.firstName}
                        onChange={(e) => handleChange("firstName", e.target.value)}
                    />

                    <TextField
                        label="Last Name"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={formData.lastName}
                        onChange={(e) => handleChange("lastName", e.target.value)}
                    />

                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                    />

                    <TextField
                        label="Phone Number"
                        fullWidth
                        sx={{ mb: 2 }}
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value)}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 2 }}
                    >
                        Register
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}
