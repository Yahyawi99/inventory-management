import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Erica_One } from "next/font/google";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const data = await authClient.getSession();
        console.log(data);
      } catch (error) {
        console.log("🚨 Failed to check Better-Auth session: ", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  return {
    user,
    isAuthenticated: !!user,
    isLoading: loading,
  };
}
