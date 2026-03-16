"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import logo from "@/assets/transparentlogo.png";

function Navbar() {
  const { isSignedIn, isLoaded } = useUser();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  // Frosted glass effect on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ✅ NO redirect here — let each page decide its own auth rules
  if (!isLoaded) return null;

  const isHero = pathname === "/"; // transparent only on landing
  console.log("Current Clerk Key:", process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);
  return (
    <nav className={`fixed top-0 left-0 w-full z-50 px-6 md:px-10 h-16 flex justify-between items-center transition-all duration-300 ${
      scrolled || !isHero
        ? "bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/[0.07] shadow-lg"
        : "bg-transparent"
    }`}>

      {/* Logo */}
      <Link href="/" className="flex items-center shrink-0">
        <Image
          src={logo}
          alt="100ACRES"
          width={120}
          height={38}
          className="object-contain"
          priority
        />
      </Link>

      {/* Center links */}
      <div className="hidden md:flex items-center gap-6 text-sm font-medium">
        {[
          { href: "/",         label: "Home"    },
          { href: "/customer", label: "Browse"  },
          { href: "/about",    label: "About"   },
        ].map(({ href, label }) => (
          <Link key={href} href={href}
            className={`transition-colors ${
              pathname === href ? "text-amber-400" : "text-gray-400 hover:text-white"
            }`}>
            {label}
          </Link>
        ))}
      </div>

      {/* Right — auth */}
      <div className="flex items-center gap-3">
        {isSignedIn ? (
          <>
            <Link href="/customer"
              className="hidden md:block text-sm text-gray-400 hover:text-white transition-colors">
              Dashboard
            </Link>
            <UserButton afterSignOutUrl="/" />
          </>
        ) : (
          <>
            <SignInButton mode="modal">
              <button className="text-sm text-gray-300 hover:text-white transition-colors cursor-pointer px-3 py-1.5">
                Login
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="text-sm font-semibold bg-gradient-to-r from-amber-500 to-amber-600 text-black px-4 py-2 rounded-xl hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 transition-all cursor-pointer">
                Sign Up
              </button>
            </SignUpButton>
          </>
        )}
      </div>

    </nav>
  );
}

export default Navbar;