"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });

      setOrders(data || []);
      setLoading(false);
    };

    loadOrders();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading your orders...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-10">My Orders</h1>

        {orders.length === 0 ? (
          <p className="text-neutral-400">You have not placed any orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-neutral-900 p-6 rounded-xl">

                <div className="flex justify-between mb-4">
                  <p className="font-semibold">Order ID: {order.id}</p>
                  <p className="text-sm text-neutral-400">
                    {new Date(order.created_at).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <p>Total: ₹{order.total_amount}</p>
                <p>Payment: {order.payment_method}</p>
                <p className="text-neutral-400 text-sm mt-2">
                  Delivery Address: {order.address}
                </p>

              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
