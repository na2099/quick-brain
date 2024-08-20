"use client";

import CheckoutPage from "@/components/CheckoutPage";
import convertToSubcurrency from "@/lib/convertToSubcurrency";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

if (process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY === undefined) {
  throw new Error("NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not defined.");
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

export default function PaymentPage() {
  const amount = 5.00; 

  return (
    <main className="flex flex-col justify-center items-center min-h-screen p-5 bg-gradient-to-r from-sky-400 to-blue-500">
      <div className="text-center mb-10 text-white">
        <h1 className="text-4xl font-extrabold mb-4">QuickBrain Payment</h1>
        <p className="text-lg">You are about to purchase Pro features for only <span className="font-bold">${amount}</span></p>
      </div>

      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <Elements 
          stripe={stripePromise}
          options={{
              mode: "payment",
              amount: convertToSubcurrency(amount), // cents
              currency: "usd",
          }}
        >
          <CheckoutPage amount={amount} />
        </Elements>
      </div>
    </main>
  );
}