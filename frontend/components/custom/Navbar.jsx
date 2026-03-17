"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useUser, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import logo from "@/assets/transparentlogo.png";

function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isSignedIn, user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isSignedIn) {
      setIsLoggedIn(true);
    }
  }, [isSignedIn, router]);
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
      {/* links */}
      <div className="flex items-center gap-6">
        <Link href="/" className='text-mid hover:text-2xl transition-all duration-300'>Home</Link>
        <Link href="/About" className='text-mid hover:text-2xl transition-all duration-300'>About</Link>
        {
          isLoggedIn ? (
            <>
              <Link href="/" className='text-mid hover:text-2xl transition-all duration-300'>Dashboard</Link>
              <SignedIn>
                <div className="flex items-center gap-4">
                  <UserButton />
                  <p>Hello {user?.firstName}!</p>
                </div>
              </SignedIn>
            </>
          ) : (
            <>
              <p className='text-mid hover:text-2xl transition-all duration-300'><SignInButton>
                Sign-In
              </SignInButton></p>
              <SignUpButton mode='modal'
                forceRedirectUrl="/onboarding">
                <button className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition">Sign Up</button>
              </SignUpButton>
            </>
          )
        }
      </div>

    </nav>
  );
}

export default Navbar;