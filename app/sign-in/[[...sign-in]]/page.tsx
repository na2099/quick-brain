"use client";

import { useEffect } from "react";
import { SignIn, useAuth } from "@clerk/nextjs";
import { useRouter, useSearchParams } from "next/navigation";

export default function SignInPage() {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get("redirectUrl");

  useEffect(() => {
    if (isLoaded && userId) {
      router.push(redirectUrl || "/");
    }
  }, [isLoaded, userId, redirectUrl, router]);

  if (!isLoaded) {
    // Show a loading state while waiting for Clerk to load the auth state
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <SignIn 
        routing="path" 
        path="/sign-in" 
        fallbackRedirectUrl={redirectUrl || "/"}
      />
    </div>
  );
}