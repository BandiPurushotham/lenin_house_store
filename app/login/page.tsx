"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Invalid credentials");
      return;
    }

    router.push("/");
  };

  return (
    <main className="min-h-screen bg-neutral-100 flex items-center justify-center px-6">
      <div className="bg-white p-10 rounded-xl shadow-sm w-full max-w-md">

        <h1 className="text-3xl font-light mb-10 text-neutral-900">
          Login
        </h1>

        <div className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 border border-neutral-300 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"

            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 border border-neutral-300 rounded-md text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"

            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="w-full bg-neutral-900 text-white py-4 rounded-md hover:bg-neutral-800 transition"
          >
            Login
          </button>

          <p className="text-sm text-neutral-500 text-center">
            New here?{" "}
            <Link href="/signup" className="text-neutral-900">
              Create Account
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
}
