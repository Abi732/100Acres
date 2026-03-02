"use client";

import React, { useEffect } from "react";
import { UserButton, SignedIn, useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import hero from "../assets/Hero.jpg";
import Navbar from "@/components/custom/Navbar";

function Page() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();

  // useEffect(() => {
  //   if (isLoaded && !isSignedIn) {
  //     router.push("/login");
  //   }
  // }, [isLoaded, isSignedIn, router]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <>
      <div className="relative h-screen w-full">
        <Image
          src={hero}
          alt="Hero Image"
          fill
          priority
          className="object-cover"
        />
      </div>
      <div className="absolute inset-0 bg-black/60">
        {/* navbar */}
      <Navbar />
      {/* hero content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6">
        <h1 className=" text-5xl md:text-6xl font-bold mb-6">Managing a hundred acres feels like a walk in the park</h1>
        <p className="text-lg md:text-xl text-gray-200 max-w-2xl">Precision at your fingertips, peace of mind for every property</p>
      </div>

      </div>
      <main className="">
        <SignedIn>
          <div className="flex items-center gap-4">
            <UserButton />
            <p>Hello {user?.firstName}!</p>
          </div>
        </SignedIn>
      </main>
    </>
  );
}

export default Page;
