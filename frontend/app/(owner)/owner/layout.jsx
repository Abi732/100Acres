"use client";

// frontend/app/(owner)/owner/layout.jsx

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useCurrentUser, getDashboardPath } from "@/lib/useCurrentUser";

const ALLOWED_ROLES = ["owner"];

export default function OwnerLayout({ children }) {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const { role, loading, needsOnboarding } = useCurrentUser();

  useEffect(() => {
    if (!isLoaded || loading) return;
    if (!isSignedIn)                   { router.replace("/");           return; }
    if (needsOnboarding || !role)      { router.replace("/onboarding"); return; }
    if (!ALLOWED_ROLES.includes(role)) { router.replace(getDashboardPath(role)); }
  }, [isLoaded, isSignedIn, role, loading, needsOnboarding, router]);

  if (!isLoaded || loading || !isSignedIn || !role || !ALLOWED_ROLES.includes(role)) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
}