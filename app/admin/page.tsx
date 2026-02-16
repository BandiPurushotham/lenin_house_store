"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";


export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);


  useEffect(() => {
    const checkAdminAndLoadOrders = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        router.push("/login");
        return;
      }

      // Get profile
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userData.user.id)
        .single();

      if (!profile || profile.role !== "admin") {
        router.push("/");
        return;
      }

      // Fetch all orders
      const { data:ordersData } = await supabase
        .from("orders")
        .select(`
          *
        )
        `)
        .order("created_at", { ascending: false });


      setOrders(ordersData || []);
      setLoading(false);
    };

    checkAdminAndLoadOrders();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-10">
          Admin Dashboard
        </h1>

        {orders.length === 0 ? (
          <p className="text-neutral-400">No orders yet.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-neutral-900 p-6 rounded-xl shadow-md"
              >
                <div className="flex justify-between mb-4">
                  <h2 className="font-semibold">
                    Order ID: {order.id}
                  </h2>
                  <span className="text-sm text-neutral-400">
                    {new Date(order.created_at).toLocaleString("en-IN", {
                      timeZone: "Asia/Kolkata",
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">

                  <div>
                    <p><span className="text-neutral-400">Customer:</span> {order.full_name}</p>
                    <p><span className="text-neutral-400">Email:</span> {order.email}</p>
                    <p><span className="text-neutral-400">Phone:</span> {order.phone}</p>
                  </div>

                  <div>
                    <p><span className="text-neutral-400">Address:</span> {order.address}</p>
                    <p><span className="text-neutral-400">Payment:</span> {order.payment_method}</p>
                    <p className="text-lg font-semibold mt-2">
                      ₹{order.total_amount}
                    </p>
                  </div>

                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
