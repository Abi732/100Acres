"use client";

import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import Image from "next/image";
import { useState, useEffect } from "react";
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import React from "react";
import logo from "@/assets/transparentlogo.png";
import Link from "next/link";

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
    <nav className="absolute top-10 left-0 w-full z-50 px-5 flex justify-between items-center text-white">
      {/* logo */}
      <Link href="/" className="flex items-center">
        <Image
          src={logo}
          alt="MyApp Logo"
          width={140}
          height={40}
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
