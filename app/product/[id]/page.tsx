"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter, useParams } from "next/navigation";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();

  const [product, setProduct] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .eq("id", params.id)
        .single();

      setProduct(data);
    };

    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user || null);
    };

    fetchProduct();
    getUser();
  }, [params.id]);

  const handleAddToCart = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_id", product.id)
      .maybeSingle();

    if (existingItem) {
      await supabase
        .from("cart_items")
        .update({
          quantity: existingItem.quantity + 1,
        })
        .eq("id", existingItem.id);
    } else {
      await supabase.from("cart_items").insert({
        user_id: user.id,
        product_id: product.id,
        quantity: 1,
      });
    }

    alert("Added to cart");
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-100">
        Loading product...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-900 px-6 py-20">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12md:gap-20 items-center">

        <img
          src={product.image_url}
          alt={product.name}
          className="w-full rounded-xl shadow-md"
        />

        <div>
          <h1 className="text-4xl font-light mb-8">
            {product.name}
          </h1>

          <p className="text-neutral-600 mb-10 leading-relaxed">
            {product.description}
          </p>

          <p className="text-3xl font-medium mb-12">
            ₹{product.price}
          </p>

          <button
            onClick={handleAddToCart}
            className="bg-neutral-900 text-white py-4 px-10 rounded-md hover:bg-neutral-800 transition"
          >
            Add to Cart
          </button>
        </div>

      </div>
    </main>
  );
}
