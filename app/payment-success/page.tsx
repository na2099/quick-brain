"use client"

export default function PaymentSuccess() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-tr from-blue-500 to-sky-500 text-white p-10">
      <div className="bg-white rounded-lg p-8 shadow-lg text-center max-w-md">
        <h1 className="text-5xl font-extrabold text-blue-600 mb-4">Success!</h1>
        <p className="text-lg font-medium text-gray-800">
          Your payment was processed successfully.
        </p>
        <p className="text-lg font-medium text-gray-800">
          Thank you for your purchase!
        </p>
        <div className="mt-6">
          <button
            onClick={() => window.location.href = "/"}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition ease-in-out duration-300"
          >
            Return to Home
          </button>
        </div>
      </div>
    </main>
  );
}
