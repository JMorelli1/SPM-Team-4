import type { FavoritedObj } from "./FavoritedObj";

export type User = {
    id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    favorites?: FavoritedObj[];
};