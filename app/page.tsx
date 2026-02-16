"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [activeCategory, setActiveCategory] = useState("all");


  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user || null);
    };
    getUser();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      setProducts(data || []);
      setFilteredProducts(data || []);
      
    };
      
    fetchProducts();
  }, []);
  <section className="flex justify-center gap-8 mb-10 text-sm uppercase tracking-wide">
  {["all", "shirts", "pants", "blazers"].map((cat) => (
    <button
      key={cat}
      onClick={() => setActiveCategory(cat)}
      className={`pb-2 border-b-2 transition ${
        activeCategory === cat
          ? "border-neutral-900 text-neutral-900"
          : "border-transparent text-neutral-400 hover:text-neutral-900"
      }`}
    >
      {cat}
    </button>
  ))}
</section>


  // 🔎 Search + Sort Logic
  useEffect(() => {
    let updated = [...products];
    // Category filter
if (activeCategory !== "all") {
  updated = updated.filter(
    (product) => product.category === activeCategory
  );
}


    // Search filter
    if (search.trim() !== "") {
      updated = updated.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Sort filter
    if (sortOrder === "low") {
      updated.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "high") {
      updated.sort((a, b) => b.price - a.price);
    } else {
      updated.sort(
        (a, b) =>
          new Date(b.created_at).getTime() -
          new Date(a.created_at).getTime()
      );
    }

    setFilteredProducts(updated);
  }, [search, sortOrder, products]);

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      router.push("/login");
      return;
    }

    const { data: existingItem } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", user.id)
      .eq("product_id", productId)
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
        product_id: productId,
        quantity: 1,
      });
    }

    alert("Added to cart");
  };

  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-900 px-6 py-12">
      <div className="max-w-7xl mx-auto">

        {/* Hero */}
        <section className="text-center mb-16">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-light tracking-[0.2em] uppercase text-center">

            The Lenin House
          </h1>
          <p className="mt-4 text-neutral-500">
            Premium linen garments crafted for modern men.
          </p>
        </section>

        {/* 🔎 Search & Sort Controls */}
        <section className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          <input
            type="text"
            placeholder="Search products..."
            className="w-full md:w-1/3 p-3 border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="p-3 border border-neutral-300 rounded-md text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="newest">Newest</option>
            <option value="low">Price: Low to High</option>
            <option value="high">Price: High to Low</option>
          </select>
        </section>

        {/* Product Grid */}
        <section className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">

          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition duration-300"
            >
              
              <div className="overflow-hidden">
                <img
  src={product.image_url}
  alt={product.name}
  onClick={() => router.push(`/product/${product.id}`)}
  className="w-full h-64 object-cover group-hover:scale-105 transition duration-500 cursor-pointer"
/>

              </div>

                <div className="p-4 sm:p-5">

                <h3 className="text-lg font-medium mb-2">
                  {product.name}
                </h3>

                <p className="text-neutral-500 text-sm mb-4">
                  {product.description}
                </p>

                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">
                    ₹{product.price}
                  </span>

                  <button
                    onClick={() => handleAddToCart(product.id)}
                    className="bg-neutral-900 text-white px-4 py-2 text-sm rounded-md hover:bg-neutral-700 transition"
                  >
                    Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

      </div>
    </main>
  );
}
