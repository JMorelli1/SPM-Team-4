export type MovieCredits = {
    id: number;
    cast: Array<{
        cast_id: number;
        id:number;
        character: string;
        credit_id: string;
        profile_path: string | null;
        name: string;
        known_for_department: string;
        order: number;
    }>;
}