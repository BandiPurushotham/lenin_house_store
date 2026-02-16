"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [cartCount, setCartCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user || null);

      if (data.user) {
        const { count } = await supabase
          .from("cart_items")
          .select("*", { count: "exact", head: true })
          .eq("user_id", data.user.id);

        setCartCount(count || 0);
      }
    };

    loadUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <header className="bg-neutral-100 border-b border-neutral-200 px-4 sm:px-8 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* Brand */}
        <Link
          href="/"
          className="text-2xl font-light tracking-[0.1em] uppercase text-neutral-900"
>
          The Lenin House
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-8">

          <Link
            href="/"
            className="text-sm text-neutral-600 hover:text-neutral-900 transition"
          >
            Home
          </Link>

          <Link
            href="/cart"
            className="relative text-neutral-600 hover:text-neutral-900 transition"
          >
            <ShoppingBag size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-3 bg-neutral-900 text-white text-xs px-2 py-0.5 rounded-full">
                {cartCount}
              </span>
            )}
          </Link>

          {!user ? (
            <Link
              href="/login"
              className="text-sm text-neutral-600 hover:text-neutral-900 transition"
            >
              Login
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-9 h-9 rounded-full bg-neutral-900 text-white text-sm flex items-center justify-center"
              >
                {user.email?.charAt(0).toUpperCase()}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-4 w-56 bg-white shadow-lg rounded-xl border border-neutral-200 p-4 z-50">
                  <p className="text-xs text-neutral-500 mb-3 break-all">
                    {user.email}
                  </p>

                  <Link
                    href="/my-orders"
                    className="block text-sm py-2 hover:text-neutral-900 text-neutral-600"
                  >
                    My Orders
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="block text-sm py-2 text-neutral-600 hover:text-neutral-900 w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
