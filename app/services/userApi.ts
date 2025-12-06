import type { User } from "~/types/User";

export const loginUser = async (username: String, password: String) => {
    const response = await fetch('/api/user/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json();
}

export const registerUser = async (userRegistrationRequest: {
    username: String,
    password: String,
    firstName?: String,
    lastName?: String,
    email?: String,
    phone?: String
}) => {
    const response = await fetch('/api/user/user', {
        method: 'POST',
        body: JSON.stringify(userRegistrationRequest),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json();
}

export const fetchUserDetails = async (userId: string | null): Promise<User> => {
    const response = await fetch(`/api/user/user/${userId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json();
}

export const addUserFavorite = async ({ userId, favoriteId }: { userId: string, favoriteId: number }) => {
    const response = await fetch(`/api/user/user/favorite`, {
        method: 'POST',
        body: JSON.stringify(
            {
                userId: userId,
                favoriteId: favoriteId,
                favoriteType: 'MOVIE'
            }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json();
}

export const removeUserFavorite = async ({ userId, favoriteId }: { userId: string, favoriteId: number }) => {
    const response = await fetch(`/api/user/user/favorite`, {
        method: 'DELETE',
        body: JSON.stringify(
            {
                userId: userId,
                favoriteId: favoriteId,
                favoriteType: 'MOVIE'
            }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return response.json();
}