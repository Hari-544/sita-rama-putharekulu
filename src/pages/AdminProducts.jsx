import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import {
  useEffect,
  useState,
} from "react";

import { db } from "../firebase";
import { products as fallbackProducts } from "../data/products";

function AdminProducts({ embedded = false }) {

  const [products, setProducts] =
    useState([]);   

  const [editingId,setEditingId] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [imageUpload,
  setImageUpload] =
    useState(null);

  const [originalImageUrl, setOriginalImageUrl] = useState("");

  const [product, setProduct] =
    useState({
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

    const pageInnerClass = embedded
      ? "w-full"
      : "mx-auto w-full max-w-screen-2xl";

    const pageTitleClass = embedded
      ? "hidden"
      : "mb-8 text-[clamp(2rem,4vw,3.5rem)] font-black text-orange-700";

  /* FETCH PRODUCTS */

  useEffect(() => {
    try {
      const unsubscribe = onSnapshot(
        collection(db, "products"),
        (snapshot) => {
          setProducts(
            snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          );
        },
        (err) => {
          console.error("Products snapshot error:", err);
          if (err && err.code === "permission-denied") {
            // fallback to local static product list for offline/admin-less viewers
            const fallback = fallbackProducts.map((p) => ({ ...p, id: String(p.id) }));
            setProducts(fallback);
          } else {
            setProducts([]);
          }
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error("Failed to initialize products listener:", err);
      const fallback = fallbackProducts.map((p) => ({ ...p, id: String(p.id) }));
      setProducts(fallback);
      return () => {};
    }
  }, []);

  /* ADD PRODUCT */

  const addProduct =
    async () => {

      try {

        if (
          !product.name ||
          !product.price ||
          !product.category ||
          !product.description ||
          !imageUpload
        ) {

          alert(
            "Please fill all fields"
          );

          return;

        }

        setLoading(true);

        /* UPLOAD IMAGE */

        let imageUrl = "";

        const imageData =
          new FormData();

        imageData.append(
          "file",
          imageUpload
        );

        imageData.append(
          "upload_preset",
          "sweetstore_products"
        );

        const response =
          await fetch(
            "https://api.cloudinary.com/v1_1/sweets-store/image/upload",
            {
              method: "POST",
              body: imageData,
            }
          );

        const data =
          await response.json();

        imageUrl =
          data.secure_url;

        /* SAVE PRODUCT */

        await addDoc(
          collection(
            db,
            "products"
          ),
          {
            name:
              product.name,

            price:
              Number(
                product.price
              ),

            image:
              imageUrl,

            category:
              product.category,

            description:
              product.description,

            featured:
              product.featured,

            stock:
              product.stock,

            createdAt:
              new Date(),
          }
        );

        alert(
          "Product Added ✅"
        );

        /* RESET */

        setProduct({
          name: "",
          price: "",
          category: "",
          description: "",
          featured: false,
          stock: true,
        });

        setImageUpload(
          null
        );

        setLoading(false);

      } catch (error) {

        console.log(error);

        alert(
          "Failed To Add Product"
        );

        setLoading(false);

      }

    };

  /* DELETE PRODUCT */

  const deleteProduct =
    async (id) => {

      try {

        await deleteDoc(
          doc(
            db,
            "products",
            id
          )
        );

        alert(
          "Deleted ✅"
        );

      } catch (error) {

        console.log(error);

      }

    };
  

  /* START EDIT MODE */
  const startEdit = (item) => {
    setProduct({
      name: item.name || "",
      price: String(item.price || ""),
      category: item.category || "",
      description: item.description || "",
      featured: Boolean(item.featured),
      stock: item.stock !== false,
      // Keep image URL on the product object so update can access it
      image: item.image || "",
    });

    setOriginalImageUrl(item.image || "");
    setImageUpload(null);
    setEditingId(item.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* UPDATE PRODUCT */
  const updateProduct = async () => {
    if (!editingId) return;

    try {
      setLoading(true);

      // Determine final image URL: upload new file if provided, otherwise preserve original
      let imageUrl = originalImageUrl || "";

      if (imageUpload) {
        const imageData = new FormData();
        imageData.append("file", imageUpload);
        imageData.append("upload_preset", "sweetstore_products");

        const response = await fetch(
          "https://api.cloudinary.com/v1_1/sweets-store/image/upload",
          { method: "POST", body: imageData }
        );

        const data = await response.json();
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

      alert("Product Updated ✅");

      // Reset form and edit state
      setProduct({ name: "", price: "", category: "", description: "", featured: false, stock: true });
      setImageUpload(null);
      setOriginalImageUrl("");
      setEditingId(null);
      setLoading(false);
    } catch (error) {
      console.error("Failed to update product:", error);
      alert("Failed To Update Product");
      setLoading(false);
    }
  };

  return (

    <div className={pageShellClass}>

      <div className={pageInnerClass}>

        <h1 className={pageTitleClass}>
          Product Management
        </h1>

        {/* FORM */}

        {/* FORM */}

        <div className="panel-shell p-6 mb-10">

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

            <input
              type="text"
              placeholder="Product Name"
              value={product.name}
              onChange={(e) =>
                setProduct({ ...product, name: e.target.value })
              }
            />

            <input
              type="number"
              placeholder="Price"
              value={product.price}
              onChange={(e) =>
                setProduct({ ...product, price: e.target.value })
              }
            />

            <input
              type="text"
              placeholder="Category"
              value={product.category}
              onChange={(e) =>
                setProduct({ ...product, category: e.target.value })
              }
            />

            <input
              type="file"
              onChange={(e) => setImageUpload(e.target.files[0])}
              className="!padding-0 border border-orange-200/50 bg-white"
            />

          </div>

          <textarea
            placeholder="Description"
            value={product.description}
            onChange={(e) => setProduct({ ...product, description: e.target.value })}
            className="mt-5"
            rows="4"
          />

          <div className="flex flex-wrap gap-5 mt-5">

            
            <label className="flex items-center gap-2 font-semibold">

              <input
                type="checkbox"
                checked={
                  product.featured
                }
                onChange={(e) =>
                  setProduct({
                    ...product,
                    featured:
                      e.target.checked,
                  })
                }
                className="!w-5 !h-5"
              />

              Featured Product

            </label>

            <label className="flex items-center gap-2 font-semibold">

              <input
                type="checkbox"
                checked={
                  product.stock
                }
                onChange={(e) =>
                  setProduct({
                    ...product,
                    stock:
                      e.target.checked,
                  })
                }
                className="!w-5 !h-5"
              />

              In Stock

            </label>

          </div>

          <button
            onClick={ editingId ? updateProduct : addProduct }
            disabled={ loading }
            className="btn btn-primary mt-6 w-full sm:w-fit py-4 text-base font-bold"
          >
            {loading
              ? (editingId ? "Updating..." : "Uploading...")
              : (editingId ? "Update Product" : "Add Product")}
          </button>

        </div>

        {/* PRODUCTS */}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {products.map(
            (item) => (

              <div
                key={item.id}
                className="bg-white rounded-3xl border border-orange-100 shadow-sm overflow-hidden"
              >

                <img
                  src={item.image}
                  alt={item.name}
                  className="aspect-[4/3] w-full object-cover"
                />

                <div className="p-5">

                  <h2 className="text-2xl font-black text-stone-900">
                    {
                      item.name
                    }
                  </h2>

                  <p className="text-orange-700 text-2xl font-black mt-2">
                    ₹
                    {
                      item.price
                    }
                  </p>

                  <p className="text-stone-500 mt-3">
                    {
                      item.description
                    }
                  </p>

                  <div className="flex flex-wrap gap-2 mt-4">

                    <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-sm font-bold">
                      {
                        item.category
                      }
                    </span>

                    {item.featured && (
                      <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm font-bold">
                        Featured
                      </span>
                    )}

                    {item.stock ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                        In Stock
                      </span>
                    ) : (
                      <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">
                        Out Of Stock
                      </span>
                    )}

                  </div>

                  <div className="mt-5 btn-group">
                    <button
                      onClick={() => startEdit(item)}
                      className="btn btn-secondary w-full sm:flex-1"
                    >
                      Edit Product
                    </button>

                    <button
                      onClick={() => deleteProduct(item.id)}
                      className="btn btn-danger w-full sm:flex-1"
                    >
                      Delete Product
                    </button>
                  </div>

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </div>

  );

}

export default AdminProducts;