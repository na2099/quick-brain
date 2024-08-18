import Link from "next/link";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

export default function Navbar() {
  return (
    <header className="bg-transparent">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <div className="text-lg font-bold">
          <p className="text-inherit">QuickBrain</p>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/collections">
            <button className="text-white bg-gray-800 hover:bg-gray-900 px-4 py-2 rounded">
              Collections
            </button>
          </Link>
          <Link href="/generations">
            <button className="text-white bg-gray-800 hover:bg-gray-900 px-4 py-2 rounded">
              Generations
            </button>
          </Link>
          <SignedOut>
            <div className="space-x-4">
              <Link href="/sign-in">
                <button className="text-white bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded">
                  Sign In
                </button>
              </Link>
              <Link href="/sign-up">
                <button className="text-white bg-green-800 hover:bg-blue-600 px-4 py-2 rounded">
                  Sign Up
                </button>
              </Link>
            </div>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>
      </nav>
      <hr className="border-t-2 border-gray-200 mt-1 w-3/4 mx-auto" />
    </header>
  );
}