// frontend/components/custom/Navbar.jsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  useUser, SignInButton, SignUpButton,
  UserButton, SignedIn, SignedOut,
} from "@clerk/nextjs";

import logo from "@/assets/transparentlogo.png";
import { useCurrentUser, getDashboardPath } from "@/lib/useCurrentUser";

function Navbar() {
  const { user }  = useUser();
  const router    = useRouter();
  const pathname  = usePathname();
  const { role, loading: roleLoading, needsOnboarding } = useCurrentUser();

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const handleDashboardClick = (e) => {
    e.preventDefault();
    if (roleLoading) return;
    router.push(needsOnboarding || !role ? "/onboarding" : getDashboardPath(role));
  };

  const roleBadge = {
    buyer:  "bg-amber-500/15 border-amber-500/30 text-amber-400",
    owner:  "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
    broker: "bg-violet-500/15 border-violet-500/30 text-violet-400",
    admin:  "bg-red-500/15 border-red-500/30 text-red-400",
  };

  const isOnDashboard =
    pathname.startsWith("/customer") || pathname.startsWith("/owner") ||
    pathname.startsWith("/broker")   || pathname.startsWith("/admin");

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 px-6 md:px-10 h-16 flex justify-between items-center transition-all duration-300 ${
      scrolled ? "bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/[0.07] shadow-lg" : "bg-transparent"
    }`}>
      <Link href="/" className="flex items-center shrink-0">
        <Image src={logo} alt="100ACRES" width={120} height={38} className="object-contain" priority />
      </Link>

      <div className="flex items-center gap-6">
        <Link href="/" className={`text-sm font-medium transition-colors ${pathname === "/" ? "text-amber-400" : "text-gray-400 hover:text-white"}`}>Home</Link>
        <Link href="/About" className={`text-sm font-medium transition-colors ${pathname === "/About" ? "text-amber-400" : "text-gray-400 hover:text-white"}`}>About</Link>
        

        <SignedIn>
          <button onClick={handleDashboardClick} disabled={roleLoading}
            className={`text-sm font-medium transition-colors disabled:cursor-wait ${isOnDashboard ? "text-amber-400" : "text-gray-400 hover:text-white"}`}>
            {roleLoading
              ? <span className="flex items-center gap-1.5"><span className="w-3 h-3 border border-amber-500 border-t-transparent rounded-full animate-spin inline-block" />Dashboard</span>
              : "Dashboard"}
          </button>

          <div className="flex items-center gap-3">
            {role && !roleLoading && (
              <span className={`hidden sm:inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${roleBadge[role]}`}>
                {role}
              </span>
            )}
            {needsOnboarding && !roleLoading && (
              <Link href="/onboarding" className="text-[11px] font-semibold text-amber-400 border border-amber-500/40 rounded-lg px-3 py-1.5 hover:bg-amber-500/10 transition-all">
                Complete Profile →
              </Link>
            )}
            <UserButton afterSignOutUrl="/" />
            <p className="hidden md:block text-sm text-gray-400">Hello, <span className="text-white font-semibold">{user?.firstName}!</span></p>
          </div>
        </SignedIn>

        <SignedOut>
          <SignInButton>
            <button className="text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer">Sign In</button>
          </SignInButton>
          <SignUpButton mode="modal" forceRedirectUrl="/onboarding">
            <button className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-amber-500/30 transition-all cursor-pointer">Sign Up</button>
          </SignUpButton>
        </SignedOut>
      </div>
    </nav>
  );
}

export default Navbar;