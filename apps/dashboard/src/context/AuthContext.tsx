"use client";

import React, { useState, useContext, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { User } from "@/types/auth";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  refetchState: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = async () => {
    try {
      const { data } = await authClient.getSession();
      const userData = data?.user && data?.user;
      const sessionData = data?.session;

      if (userData) {
        const newUser: User = {
          id: userData?.id,
          name: userData?.name,
          email: userData?.email,
          activeOrganizationId: sessionData?.activeOrganizationId,
        };
        setUser(newUser);
      } else {
        setUser(null);
        console.log(await authClient.getSession());
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();

    const handleFocus = () => {
      fetchSession();
    };
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading: loading,
        refetchState: fetchSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
