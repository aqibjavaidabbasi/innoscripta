import React, { createContext, useState, useEffect, ReactNode } from "react";
import { getAuthToken, saveAuthToken, removeAuthToken } from "../utils/api";

interface AuthContextType {
   isAuthenticated: boolean;
   login: (token: string) => void;
   logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

   useEffect(() => {
      const token = getAuthToken();
      if (token) {
         setIsAuthenticated(true);
      }
   }, []);

   const login = (token: string) => {
      saveAuthToken(token);
      setIsAuthenticated(true);
      window.location.href = "/"; 
   };

   const logout = () => {
      removeAuthToken();
      setIsAuthenticated(false);
      window.location.href = "/login"; 
   };

   return (
      <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
         {children}
      </AuthContext.Provider>
   );
};
