"use client";
import axios from "axios";
import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

type User = {
  id: string;
  email: string;
  username?: string;
  role?: string;
};

type UserContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    /*const fetchUser = async () => {
      try {
        const response = await axios.get(
          `${process.env.API_CONNECTION_STRING}/auth/me`, 
          { withCredentials: true }
        );
        if (response.status === 200) {
          setUser(response.data.user); // Update user if backend session is valid
        }
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          // Handle unauthorized error (user not authenticated)
          setUser(null); // Clear user state
          localStorage.removeItem("user"); // Remove user data from localStorage
        } else {
          // Handle other errors (network error, etc.)
          console.error("Error fetching user from /me endpoint:", error);
          setUser(null); // Clear user state on error
        }
      }
    };

    if (!storedUser) {
      fetchUser();
    }*/
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
