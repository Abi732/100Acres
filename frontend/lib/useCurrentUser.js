// frontend/lib/useCurrentUser.js
// Fetches the current user's role from your backend (MongoDB)
// Returns: { dbUser, role, loading, error, needsOnboarding }

"use client";

import { useState, useEffect } from "react";
import { useAuth, useUser } from "@clerk/nextjs";

export function useCurrentUser() {
  const { isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();

  const [dbUser,          setDbUser]          = useState(null);
  const [loading,         setLoading]         = useState(true);
  const [error,           setError]           = useState(null);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);

  useEffect(() => {
    // wait for Clerk to finish loading
    if (!isLoaded) return;

    // not signed in — nothing to fetch
    if (!isSignedIn) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        setLoading(true);
        const token = await getToken();

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const data = await res.json();

        if (!res.ok) {
          if (data.needsOnboarding) {
            setNeedsOnboarding(true);
          } else {
            setError(data.message || "Failed to fetch user");
          }
          return;
        }

        setDbUser(data.user);
        setNeedsOnboarding(false);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isLoaded, isSignedIn, getToken]);

  return {
    dbUser,
    role:           dbUser?.role ?? null,    // "buyer" | "owner" | "agent" | "admin"
    loading,
    error,
    needsOnboarding,
  };
}

// Role → dashboard path mapping
export const ROLE_DASHBOARD = {
  buyer: "/dashboard/buyer",
  owner: "/dashboard/owner",
  agent: "/dashboard/agent",
  admin: "/dashboard/admin",
};

export function getDashboardPath(role) {
  return ROLE_DASHBOARD[role] ?? "/onboarding";
}