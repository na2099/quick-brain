import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export default function LandingPage() {
  return (
    <header className="bg-transparent">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <div className="text-lg font-bold">
          <p className="text-inherit">QuickBrain</p>
        </div>
        <div className="flex items-center">
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
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-6xl font-bold mt-10">Welcome to QuickBrain</div>
      </div>
    </header>
  );
}