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
        router.push("/");
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
        <Link href="/">Home</Link>
        <Link href="/About">About</Link>
        {
            isLoggedIn ? (
                <>
                <Link href="/">Dashboard</Link>
                <SignInButton mode='modal'>
                <button className="px-4 py-2 border border-white rounded-lg hover:bg-white hover:text-black transition"> Logout</button>
                </SignInButton>
                </>
            ):(
                <>
                <SignInButton>
                Login
                </SignInButton>
                <SignUpButton>
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
