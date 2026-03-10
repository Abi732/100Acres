"use client"; // Required for hooks
import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useUser, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs';
import logo from "@/assets/transparentlogo.png"

function Navbar() {

  const { isSignedIn, isLoaded } = useUser();
  const router = useRouter();

  // Redirect logic: If they sign in, take them to home/dashboard
  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/");
    }
  }, [isSignedIn, isLoaded, router]);

  if (!isLoaded) return null;

  return (
    <nav className="absolute top-10 left-0 w-full z-50 px-5 flex justify-between items-center text-white">
      {/* logo */}
      <Link href="/" className="flex items-center">
        <Image
          src={logo} // Ensure this path is correct
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
        
        {/* 2. Use Clerk's 'isSignedIn' directly */}
        {isSignedIn ? (
          <>
            <Link href="/dashboard">Dashboard</Link>
            {/* 3. Use UserButton for a professional Profile/Logout experience */}
            <UserButton afterSignOutUrl="/" />
          </>
        ) : (
          <>
            <SignInButton mode="modal">
              <button className="cursor-pointer">Login</button>
            </SignInButton>
            
            <SignUpButton mode="modal">
              <button className="px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition">
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