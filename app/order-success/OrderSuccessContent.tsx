"use client";

import { useSearchParams } from "next/navigation";

export default function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <main className="min-h-screen bg-neutral-100 flex items-center justify-center px-6">
      <div className="bg-white p-12 rounded-xl shadow-sm text-center max-w-md">

        <h1 className="text-3xl font-light mb-6 text-neutral-900">
          Order Placed Successfully
        </h1>

        <p className="text-neutral-600 mb-4">
          Thank you for shopping with The Lenin House.
        </p>

        {id && (
          <p className="text-neutral-500 text-sm">
            Order ID: {id}
          </p>
        )}

      </div>
    </main>
  );
}
