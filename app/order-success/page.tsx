"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function OrderSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("id");

  return (
    <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-6">
      <div className="bg-neutral-900 p-10 rounded-xl max-w-lg w-full text-center shadow-lg">

        <h1 className="text-3xl font-bold mb-6 text-green-400">
          Order Placed Successfully 🎉
        </h1>

        <p className="text-neutral-300 mb-4">
          Thank you for shopping with The Lenin House.
        </p>

        <p className="text-neutral-400 mb-8">
          Your Order ID:
        </p>

        <div className="bg-neutral-800 p-4 rounded-md font-mono mb-8">
          {orderId}
        </div>

        <p className="text-neutral-400 mb-8">
          Payment Method: Cash on Delivery
        </p>

        <Link
          href="/"
          className="inline-block bg-white text-black px-8 py-3 rounded-md font-medium hover:bg-neutral-200 transition"
        >
          Continue Shopping
        </Link>

      </div>
    </main>
  );
}
