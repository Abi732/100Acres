// frontend/lib/useCurrentUser.js
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
    if (!isLoaded) return;
    if (!isSignedIn) { setLoading(false); return; }

    const fetchUser = async () => {
      try {
        setLoading(true);
        const token = await getToken();

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/me`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = await res.json();

        if (res.status === 404 && data.needsOnboarding) {
          // ✅ Only a real 404 with needsOnboarding flag means they need onboarding
          setNeedsOnboarding(true);
          return;
        }

        if (!res.ok) {
          // Network error or server error — do NOT send to onboarding
          // just set error and keep whatever state we have
          setError(data.message || "Failed to fetch user");
          return;
        }

        setDbUser(data.user);
        setNeedsOnboarding(false);
      } catch (err) {
        // Network completely down — do NOT send to onboarding
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isLoaded, isSignedIn, getToken]);

  return { dbUser, role: dbUser?.role ?? null, loading, error, needsOnboarding };
}

export const ROLE_DASHBOARD = {
  buyer:  "/customer",
  owner:  "/owner",
  broker: "/broker/broker",
  admin:  "/admin",
};

export function getDashboardPath(role) {
  return ROLE_DASHBOARD[role] ?? "/onboarding";
}