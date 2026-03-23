"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  useUser,
  SignInButton,
  SignUpButton,
  UserButton,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";

import logo from "@/assets/transparentlogo.png";

function Navbar() {
  const { isSignedIn, user } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);

  // ✅ Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 px-6 md:px-10 h-16 flex justify-between items-center transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/[0.07] shadow-lg"
          : "bg-transparent"
      }`}
    >
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

      {/* Links */}
      <div className="flex items-center gap-6">
        <Link href="/" className="text-mid hover:text-2xl transition-all duration-300">
          Home
        </Link>
        <Link href="/About" className="text-mid hover:text-2xl transition-all duration-300">
          About
        </Link>

        {/* ✅ Auth handling (clean) */}
        <SignedIn>
          <Link href="/" className="text-mid hover:text-2xl transition-all duration-300">
            Dashboard
          </Link>

          <div className="flex items-center gap-4">
            <UserButton />
            <p>Hello {user?.firstName}!</p>
          </div>
        </SignedIn>

        <SignedOut>
          <SignInButton>
            <button className="text-mid hover:text-2xl transition-all duration-300">
              Sign-In
            </button>
          </SignInButton>

          <SignUpButton mode="modal" forceRedirectUrl="/onboarding">
            <button className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition">
              Sign Up
            </button>
          </SignUpButton>
        </SignedOut>
      </div>
    </nav>
  );
}

export default Navbar;