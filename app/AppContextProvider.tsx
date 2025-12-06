import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "./types/User";
import { useUserDetails } from "./hooks/UserHooks";

interface AppContextType {
  user: User | null;
  updateUserFavorites: () => void;
  setUser: (user: User | null) => void;
  clearUser: () => void;
  isLoggedIn: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const userQuery = useUserDetails(username);

  // Load from sessionStorage on first render
  useEffect(() => {
    setUsername(sessionStorage.getItem("username"));
  }, []);

  useEffect(() => {
    setUserState(userQuery.data || null);
  }, [userQuery.data, userQuery.isSuccess]);

  const updateUserFavorites = () => {
    userQuery.refetch().then((query) => {
      if (query.isSuccess) {
        setUserState(query.data as User);
      }
    });
  }

  const setUser = (u: User | null) => {
    setUserState(u);
    if (u) sessionStorage.setItem("username", u.username);
    else sessionStorage.removeItem("username");
  };

  const clearUser = () => {
    sessionStorage.removeItem("username");
    setUser(null);
  }

  return (
    <AppContext.Provider
      value={{
        user,
        updateUserFavorites,
        setUser,
        clearUser,
        isLoggedIn: !!user,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) {
    throw new Error("useAppContext must be used inside an AppProvider");
  }
  return ctx;
};