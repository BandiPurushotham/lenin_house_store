"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    setLoading(true);

    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) {
      router.push("/login");
      return;
    }

    const { data: cartItems } = await supabase
      .from("cart_items")
      .select("quantity, products(price)")
      .eq("user_id", userData.user.id);

    const total =
  cartItems?.reduce(
    (sum, item) =>
      sum + (item.products?.[0]?.price || 0) * item.quantity,
    0
  ) || 0;


    const { data, error } = await supabase
      .from("orders")
      .insert({
        user_id: userData.user.id,
        full_name: fullName,
        phone,
        address,
        payment_method: "COD",
        total_amount: total,
      })
      .select()
      .single();

    if (error) {
      alert("Checkout failed");
      setLoading(false);
      return;
    }

    await supabase
      .from("cart_items")
      .delete()
      .eq("user_id", userData.user.id);

    router.push(`/order-success?id=${data.id}`);
  };

  return (
    <main className="min-h-screen bg-neutral-100 px-6 py-16">
      <div className="max-w-xl mx-auto bg-white p-10 rounded-xl shadow-sm">

        <h1 className="text-3xl font-light mb-10 text-neutral-900">
          Checkout
        </h1>

        <div className="space-y-6">
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-4 border border-neutral-300 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"

            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Phone Number"
            className="w-full p-4 border border-neutral-300 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"

            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

          <textarea
            placeholder="Delivery Address"
            className="w-full p-4 border border-neutral-300 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"

            rows={4}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-neutral-900 text-white py-4 rounded-md hover:bg-neutral-800 transition duration-300"
          >
            {loading ? "Processing..." : "Place Order (Cash on Delivery)"}
          </button>
        </div>

      </div>
    </main>
  );
}
