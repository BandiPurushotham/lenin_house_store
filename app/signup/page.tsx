"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      alert(error.message);
      return;
    }

    alert("Account created successfully");
    router.push("/");
  };

  return (
    <main className="min-h-screen bg-neutral-100 flex items-center justify-center px-6">
      <div className="bg-white p-10 rounded-xl shadow-sm w-full max-w-md">

        <h1 className="text-3xl font-light mb-10 text-neutral-900">
          Create Account
        </h1>

        <div className="space-y-6">
          <input
            type="email"
            placeholder="Email"
            className="w-full p-4 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900 transition"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 border border-neutral-300 rounded-md focus:outline-none focus:ring-1 focus:ring-neutral-900 transition"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleSignup}
            className="w-full bg-neutral-900 text-white py-4 rounded-md hover:bg-neutral-800 transition"
          >
            Create Account
          </button>

          <p className="text-sm text-neutral-500 text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-neutral-900">
              Login
            </Link>
          </p>
        </div>

      </div>
    </main>
  );
}
