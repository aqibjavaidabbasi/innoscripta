import React, { createContext, useState, useContext, ReactNode, useEffect, useCallback } from "react";

// User data interface
interface User {
   id: number;
   name: string;
   email: string;
}

// AuthContext interface
interface AuthContextProps {
   isAuthenticated: boolean;
   user: User | null;
   login: (token: string, userData: User) => void;
   logout: () => void;
   checkAuthStatus: () => void;
}

// Creating AuthContext
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthProviderProps {
   children: ReactNode;
}

// AuthProvider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
   const [user, setUser] = useState<User | null>(null);

   // Function to check authentication status from localStorage
   const checkAuthStatus = useCallback(() => {
      const token = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("userData");

      const isLoggedIn = token && storedUser;
      if (isLoggedIn && (!isAuthenticated || !user)) {
         setIsAuthenticated(true);
         setUser(JSON.parse(storedUser as string));
      } else if (!isLoggedIn && isAuthenticated) {
         setIsAuthenticated(false);
         setUser(null);
      }
   }, [isAuthenticated, user]); // Use state to check for changes

   // Run on component mount to check authentication status
   useEffect(() => {
      checkAuthStatus();
   }, [checkAuthStatus]); // Only run when checkAuthStatus changes

   // Login function
   const login = (token: string, userData: User) => {
      localStorage.setItem("authToken", token);
      localStorage.setItem("userData", JSON.stringify(userData));
      setIsAuthenticated(true);
      setUser(userData);
   };

   // Logout function
   const logout = () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
      setIsAuthenticated(false);
      setUser(null);
   };

   return (
      <AuthContext.Provider value={{ isAuthenticated, user, login, logout, checkAuthStatus }}>
         {children}
      </AuthContext.Provider>
   );
};

// Custom hook to use AuthContext
export const useAuth = (): AuthContextProps => {
   const context = useContext(AuthContext);
   if (!context) {
      throw new Error("useAuth must be used within an AuthProvider");
   }
   return context;
};
