"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("cart_items")
        .select(`
          id,
          quantity,
          products (
            id,
            name,
            price,
            image_url
          )
        `)
        .eq("user_id", userData.user.id);

      setCartItems(data || []);
      setLoading(false);
    };

    loadCart();
  }, [router]);

  const updateQuantity = async (cartId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await supabase.from("cart_items").delete().eq("id", cartId);
      setCartItems((prev) => prev.filter((item) => item.id !== cartId));
      return;
    }

    await supabase
      .from("cart_items")
      .update({ quantity: newQuantity })
      .eq("id", cartId);

    setCartItems((prev) =>
      prev.map((item) =>
        item.id === cartId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const total = cartItems.reduce(
    (sum, item) =>
      sum + item.products.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
        Loading cart...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-900 px-6 py-16">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-light mb-14">
          Your Cart
        </h1>

        {cartItems.length === 0 ? (
          <p className="text-neutral-500">
            Your cart is currently empty.
          </p>
        ) : (
          <>
            {/* Items */}
            <div className="space-y-8">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white p-6 rounded-xl shadow-sm flex flex-col md:flex-row gap-8"
                >
                  <img
                    src={item.products.image_url}
                    alt={item.products.name}
                    className="w-40 h-40 object-cover rounded-lg"
                  />

                  <div className="flex-1 flex flex-col md:flex-row justify-between">
                    <div>
                      <h2 className="text-xl font-medium">
                        {item.products.name}
                      </h2>
                      <p className="text-neutral-500 mt-2">
                        ₹{item.products.price}
                      </p>
                    </div>

                    {/* Quantity */}
                    <div className="flex items-center gap-6 mt-6">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity - 1)
                        }
                        className="w-9 h-9 border border-neutral-300 rounded-md hover:bg-neutral-100 transition"
                      >
                        −
                      </button>

                      <span className="text-lg">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-9 h-9 border border-neutral-300 rounded-md hover:bg-neutral-100 transition"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Subtotal */}
                  <div className="flex items-center text-lg font-semibold">
                    ₹{item.products.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>

            {/* Total Section */}
            <div className="mt-16 bg-white p-8 rounded-xl shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
              <h2 className="text-2xl font-light">
                Total
              </h2>
              <p className="text-3xl font-medium">
                ₹{total}
              </p>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => router.push("/checkout")}
              className="mt-10 w-full bg-neutral-900 text-white py-4 rounded-md hover:bg-neutral-800 transition"
            >
              Proceed to Checkout
            </button>
          </>
        )}

      </div>
    </main>
  );
}
