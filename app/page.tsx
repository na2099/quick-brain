import Link from "next/link";
import React from "react";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function LandingPage() {
  return (
    <main>
      <nav className="flex items-center justify-between w-full p-4 bg-gray-800">
        <div className="text-white">QuickBrain</div>
        <div>
          <SignedOut>
            <button className="mr-2 text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
              <Link href="/sign-in">Sign In</Link>
            </button>
            <button className="text-white bg-green-800 hover:bg-blue-600 px-4 py-2 rounded">
              <Link href="/sign-up">Sign Up</Link>
            </button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-6xl font-bold mt-10">Welcome to QuickBrain</div>
      </div>
    </main>
  );
};


