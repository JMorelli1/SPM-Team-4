import { useMutation, useQuery } from "@tanstack/react-query";
import { loginUser, registerUser } from "~/services/userApi";

export const useLoginMutation = () => {
    return useMutation({
        mutationKey: ['userLogin'],
        mutationFn: (vars: {username: String, password: String}) => loginUser(vars.username, vars.password),
    });
}

export const useLoginRegistrationMutation = () => {
    return useMutation({
        mutationKey: ['userRegistration'],
        mutationFn: registerUser,
    });
}