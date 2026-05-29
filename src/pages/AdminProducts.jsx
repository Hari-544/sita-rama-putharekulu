import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { useEffect, useState } from "react";

import { db } from "../firebase";
import { products as fallbackProducts } from "../data/products";
import {
  cloudinarySrcSet,
  optimizeCloudinaryImage,
} from "../utils/image";

function AdminProducts({ embedded = false }) {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUpload, setImageUpload] = useState(null);
  const [originalImageUrl, setOriginalImageUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [product, setProduct] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
    featured: false,
    stock: true,
  });

  const pageShellClass = embedded
    ? "w-full"
    : "min-h-screen bg-[#fffaf5] px-4 py-6 sm:px-6 sm:py-8 lg:px-8";

  const pageInnerClass = embedded ? "w-full" : "mx-auto w-full max-w-screen-2xl";
  const pageTitleClass = embedded ? "hidden" : "mb-8 text-[clamp(2rem,4vw,3.5rem)] font-black text-orange-700";

  useEffect(() => {
    let isMounted = true;

    const loadProducts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "products"));

        if (!isMounted) return;

        setProducts(snapshot.docs.map((productDoc) => ({ id: productDoc.id, ...productDoc.data() })));
      } catch (err) {
        console.error("Failed to load products:", err);
        if (!isMounted) return;

        const fallback = fallbackProducts.map((item) => ({ ...item, id: String(item.id) }));
        setProducts(fallback);
      }
    };

    void loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (imageUpload) {
      const objectUrl = URL.createObjectURL(imageUpload);
      setPreviewUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }

    setPreviewUrl(originalImageUrl || "");
    return undefined;
  }, [imageUpload, originalImageUrl]);

  const resetForm = () => {
    setProduct({
      name: "",
      price: "",
      category: "",
      description: "",
      featured: false,
      stock: true,
    });
    setImageUpload(null);
    setOriginalImageUrl("");
    setPreviewUrl("");
    setEditingId(null);
  };

  const addProduct = async () => {
    try {
      if (!product.name || !product.price || !product.category || !product.description || !imageUpload) {
        alert("Please fill all fields");
        return;
      }

      setLoading(true);

      const imageData = new FormData();
      imageData.append("file", imageUpload);
      imageData.append("upload_preset", "sweetstore_products");

      const response = await fetch("https://api.cloudinary.com/v1_1/sweets-store/image/upload", {
        method: "POST",
        body: imageData,
      });

      const data = await response.json();
      if (!response.ok || !data?.secure_url) {
        throw new Error(data?.error?.message || data?.message || "Image upload failed");
      }

      await addDoc(collection(db, "products"), {
        name: product.name,
        price: Number(product.price),
        image: data.secure_url,
        category: product.category,
        description: product.description,
        featured: product.featured,
        stock: product.stock,
        createdAt: new Date(),
      });

      alert("Product Added ✅");
      resetForm();
    } catch (error) {
      console.error("Failed to add product:", error);
      alert("Failed To Add Product");
    } finally {
      setLoading(false);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, "products", id));
      setProducts((current) => current.filter((item) => item.id !== id));
      alert("Deleted ✅");
    } catch (error) {
      console.error("Failed to delete product:", error);
    }
  };

  const startEdit = (item) => {
    setProduct({
      name: item.name || "",
      price: String(item.price || ""),
      category: item.category || "",
      description: item.description || "",
      featured: Boolean(item.featured),
      stock: item.stock !== false,
    });
    setOriginalImageUrl(item.image || "");
    setImageUpload(null);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateProduct = async () => {
    if (!editingId) return;

    try {
      setLoading(true);

      let imageUrl = originalImageUrl || "";

      if (imageUpload) {
        const imageData = new FormData();
        imageData.append("file", imageUpload);
        imageData.append("upload_preset", "sweetstore_products");

        const response = await fetch("https://api.cloudinary.com/v1_1/sweets-store/image/upload", {
          method: "POST",
          body: imageData,
        });

        const data = await response.json();
        if (!response.ok || !data?.secure_url) {
          throw new Error(data?.error?.message || data?.message || "Image upload failed");
        }

        imageUrl = data.secure_url;
      }

      await updateDoc(doc(db, "products", editingId), {
        name: product.name,
        price: Number(product.price),
        image: imageUrl,
        category: product.category,
        description: product.description,
        featured: product.featured,
        stock: product.stock,
      });

      setProducts((current) =>
        current.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: product.name,
                price: Number(product.price),
                image: imageUrl,
                category: product.category,
                description: product.description,
                featured: product.featured,
                stock: product.stock,
              }
            : item
        )
      );

      alert("Product Updated ✅");
      resetForm();
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed To Update Product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={pageShellClass}>
      <div className={pageInnerClass}>
        <h1 className={pageTitleClass}>Product Management</h1>

        <div className="mb-8 grid gap-4 rounded-[2rem] border border-orange-100 bg-white/85 p-5 shadow-[0_20px_60px_rgba(249,115,22,0.08)] sm:p-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-600">
              Catalog Control
            </p>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-stone-950">
              Keep listings clean, fast, and easy to edit.
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-600 sm:text-base">
              Use the editor to add fresh products, update pricing, and keep imagery consistent. The form stays compact on mobile and the product cards are easier to scan at a glance.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
            {[
              "Cleaner form layout",
              "Live image preview",
              "Faster edit actions",
              "Clear stock badges",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-orange-100 bg-orange-50/70 px-4 py-3 text-sm font-semibold text-stone-700">
                {item}
              </div>
            ))}
          </div>
        </div>

        <section className="panel-shell mb-10 p-5 sm:p-6 lg:p-8">
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-5">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Product Name"
                  value={product.name}
                  onChange={(e) => setProduct({ ...product, name: e.target.value })}
                />

                <input
                  type="number"
                  placeholder="Price"
                  value={product.price}
                  onChange={(e) => setProduct({ ...product, price: e.target.value })}
                />

                <input
                  type="text"
                  placeholder="Category"
                  value={product.category}
                  onChange={(e) => setProduct({ ...product, category: e.target.value })}
                />

                <input
                  type="file"
                  onChange={(e) => setImageUpload(e.target.files?.[0] || null)}
                  className="border border-orange-200/50 bg-white"
                />
              </div>

              <textarea
                placeholder="Description"
                value={product.description}
                onChange={(e) => setProduct({ ...product, description: e.target.value })}
                rows="4"
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <label className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-4 font-semibold ${product.featured ? "border-orange-200 bg-orange-50" : "border-orange-100 bg-white"}`}>
                  <span>Featured Product</span>
                  <input
                    type="checkbox"
                    checked={product.featured}
                    onChange={(e) => setProduct({ ...product, featured: e.target.checked })}
                    className="!h-5 !w-5"
                  />
                </label>

                <label className={`flex items-center justify-between gap-4 rounded-2xl border px-4 py-4 font-semibold ${product.stock ? "border-emerald-200 bg-emerald-50" : "border-rose-200 bg-rose-50"}`}>
                  <span>In Stock</span>
                  <input
                    type="checkbox"
                    checked={product.stock}
                    onChange={(e) => setProduct({ ...product, stock: e.target.checked })}
                    className="!h-5 !w-5"
                  />
                </label>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={editingId ? updateProduct : addProduct}
                  disabled={loading}
                  className="btn btn-primary w-full py-4 text-base font-bold sm:w-auto"
                >
                  {loading ? (editingId ? "Updating..." : "Uploading...") : editingId ? "Update Product" : "Add Product"}
                </button>

                {editingId ? (
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn btn-secondary w-full py-4 text-base font-bold sm:w-auto"
                  >
                    Cancel Edit
                  </button>
                ) : null}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-orange-100 bg-gradient-to-br from-white via-orange-50/60 to-amber-50/40 p-4 sm:p-5">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-orange-600">
                Image Preview
              </p>

              <div className="mt-4 overflow-hidden rounded-[1.5rem] border border-orange-100 bg-white">
                {previewUrl ? (
                  <img
                    src={optimizeCloudinaryImage(previewUrl, 800)}
                    srcSet={cloudinarySrcSet(previewUrl, [320, 480, 640, 800])}
                    sizes="(min-width: 1280px) 30vw, (min-width: 640px) 45vw, 100vw"
                    alt={product.name || "Selected product preview"}
                    loading="lazy"
                    decoding="async"
                    width="800"
                    height="600"
                    className="aspect-[4/3] w-full object-cover"
                  />
                ) : (
                  <div className="flex aspect-[4/3] items-center justify-center px-6 text-center text-sm leading-7 text-stone-500">
                    Select an image to preview it here before saving.
                  </div>
                )}
              </div>

              <div className="mt-4 grid gap-3 text-sm text-stone-600">
                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <span className="block text-xs font-black uppercase tracking-[0.24em] text-stone-500">Mode</span>
                  <span className="mt-1 block font-semibold text-stone-900">{editingId ? "Editing existing product" : "Creating new product"}</span>
                </div>
                <div className="rounded-2xl bg-white px-4 py-3 shadow-sm">
                  <span className="block text-xs font-black uppercase tracking-[0.24em] text-stone-500">Upload</span>
                  <span className="mt-1 block font-semibold text-stone-900">
                    {imageUpload?.name || originalImageUrl || "No file selected"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-[2rem] border border-orange-100 bg-white shadow-[0_18px_50px_rgba(249,115,22,0.08)]"
            >
              <img
                src={optimizeCloudinaryImage(item.image, 560)}
                srcSet={cloudinarySrcSet(item.image, [320, 480, 640])}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                alt={item.name}
                loading="lazy"
                decoding="async"
                width="560"
                height="420"
                className="aspect-[4/3] w-full object-cover"
              />

              <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-black text-stone-900">{item.name}</h2>
                    <p className="mt-2 text-xs font-black uppercase tracking-[0.28em] text-stone-500">
                      {item.category}
                    </p>
                  </div>

                  <p className="text-2xl font-black text-orange-700">₹{item.price}</p>
                </div>

                <p className="text-sm leading-7 text-stone-600">{item.description}</p>

                <div className="flex flex-wrap gap-2">
                  {item.featured ? (
                    <span className="rounded-full bg-yellow-100 px-3 py-1 text-sm font-bold text-yellow-800">
                      Featured
                    </span>
                  ) : null}
                  <span className={`rounded-full px-3 py-1 text-sm font-bold ${item.stock ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"}`}>
                    {item.stock ? "In Stock" : "Out Of Stock"}
                  </span>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <button onClick={() => startEdit(item)} className="btn btn-secondary w-full py-3 text-sm font-bold">
                    Edit Product
                  </button>

                  <button onClick={() => deleteProduct(item.id)} className="btn btn-danger w-full py-3 text-sm font-bold">
                    Delete Product
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;
