"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase";
import { useRouter } from "next/navigation";

export default function AdminProductsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [category, setCategory] = useState("shirts");


  // 🔐 Admin Check
  useEffect(() => {
    const checkAdmin = async () => {
      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) {
        router.push("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userData.user.id)
        .single();

      if (!profile || profile.role !== "admin") {
        router.push("/");
        return;
      }

      const { data: productsData } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      setProducts(productsData || []);
      setLoading(false);
    };

    checkAdmin();
  }, [router]);

  // 🚀 Upload Image to Supabase Storage
  const uploadImage = async () => {
    if (!imageFile) return null;

    const fileName = `${Date.now()}-${imageFile.name}`;

    const { error } = await supabase.storage
      .from("product-images")
      .upload(fileName, imageFile);

    if (error) {
      console.log("Upload error:", error);
      alert("Image upload failed");
      return null;
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  // ➕ Add / ✏️ Update Product
  const handleSaveProduct = async () => {
    if (!name || !description || !price) {
      alert("Fill all fields");
      return;
    }

    let imageUrl = null;

    if (imageFile) {
      imageUrl = await uploadImage();
      if (!imageUrl) return;
    }

    if (editingId) {
      const updateData: any = {
        name,
        description,
        price: Number(price),
        category,
      };

      if (imageUrl) {
        updateData.image_url = imageUrl;
      }

      const { error } = await supabase
        .from("products")
        .update(updateData)
        .eq("id", editingId);

      if (error) {
        console.log(error);
        alert("Update failed");
        return;
      }

      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingId
            ? { ...p, ...updateData }
            : p
        )
      );

      setEditingId(null);
    } else {
      if (!imageUrl) {
        alert("Please upload an image");
        return;
      }

      const { data, error } = await supabase
        .from("products")
        .insert({
          name,
          description,
          price: Number(price),
          image_url: imageUrl,
          category,
        })
        .select()
        .single();

      if (error || !data) {
        console.log(error);
        alert("Insert failed");
        return;
      }

      setProducts((prev) => [data, ...prev]);
    }

    // Reset
    setName("");
    setDescription("");
    setPrice("");
    setImageFile(null);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("products").delete().eq("id", id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-950 text-white px-6 py-12">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-3xl font-bold mb-10">
          Product Management
        </h1>

        {/* FORM */}
        <div className="bg-neutral-900 p-6 rounded-xl mb-12">
          <h2 className="text-xl font-semibold mb-6">
            {editingId ? "Edit Product" : "Add Product"}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Product Name"
              className="p-3 rounded-md bg-neutral-800 border border-neutral-700"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <select
  className="p-3 rounded-md bg-neutral-800 border border-neutral-700 md:col-span-2"
  value={category}
  onChange={(e) => setCategory(e.target.value)}
>
  <option value="shirts">Shirts</option>
  <option value="pants">Pants</option>
  <option value="blazers">Blazers</option>
</select>


            <input
              type="number"
              placeholder="Price"
              className="p-3 rounded-md bg-neutral-800 border border-neutral-700"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />

            <input
              type="file"
              accept="image/*"
              className="p-3 rounded-md bg-neutral-800 border border-neutral-700 md:col-span-2"
              onChange={(e) => {
                if (e.target.files) {
                  setImageFile(e.target.files[0]);
                }
              }}
            />

            <textarea
              placeholder="Description"
              className="p-3 rounded-md bg-neutral-800 border border-neutral-700 md:col-span-2"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <button
            onClick={handleSaveProduct}
            className="mt-6 bg-white text-black px-6 py-3 rounded-md font-medium hover:bg-neutral-200 transition"
          >
            {editingId ? "Update Product" : "Add Product"}
          </button>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-neutral-900 p-4 rounded-xl">

              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />

              <h3 className="font-semibold mb-2">{product.name}</h3>
              <p className="text-neutral-400 text-sm mb-2">
                {product.description}
              </p>
              <p className="font-semibold mb-4">₹{product.price}</p>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setEditingId(product.id);
                    setName(product.name);
                    setDescription(product.description);
                    setPrice(product.price.toString());
                    setCategory(product.category || "shirts");

                  }}
                  className="text-blue-400 text-sm hover:text-blue-300"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-red-400 text-sm hover:text-red-300"
                >
                  Delete
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
