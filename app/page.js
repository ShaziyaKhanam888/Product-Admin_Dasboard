"use client";

import { Suspense, useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import Navbar from "@/components/Navbar";
import ProductTable from "@/components/ProductTable";
import ProductCards from "@/components/ProductCards";
import ProductFormModal from "@/components/ProductFormModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import { useDebounce } from "@/lib/hooks/useDebounce";
import {
  fetchProducts,
  fetchCategories,
  createProduct,
  updateProduct,
  deleteProductById,
} from "@/lib/api/products";
import { Search, Plus, RotateCcw, Loader2, AlertCircle } from "lucide-react";

// --- 1. Internal Component (Handles all logic & useSearchParams) ---
function ProductsList() {
  const searchParams = useSearchParams();
  const search = searchParams.get("q");

  return <div>Search parameter: {search}</div>;
}
function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // State
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  // Sync state from URL
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const search = searchParams.get("q") || "";
  const category = searchParams.get("category") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const order = searchParams.get("order") || "asc";

  const [searchTerm, setSearchTerm] = useState(search);
  const debouncedSearch = useDebounce(searchTerm, 500);

  const abortControllerRef = useRef(null);

  // Helper to update URL params
  const updateQueryParams = useCallback(
    (newParams) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      Object.entries(newParams).forEach(([key, value]) => {
        if (value === null || value === undefined || value === "") {
          current.delete(key);
        } else {
          current.set(key, String(value));
        }
      });
      router.push(`/products?${current.toString()}`);
    },
    [router, searchParams],
  );

  // Sync debounced search with URL
  useEffect(() => {
    if (debouncedSearch !== search) {
      updateQueryParams({ q: debouncedSearch, page: 1, category: "" });
    }
  }, [debouncedSearch, search, updateQueryParams]);

  // Initial Auth Guard & Categories Load
  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetchCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error("Failed to load categories", err));
  }, [router]);

  // Main Load Products Function
  const loadProducts = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    setLoading(true);
    setError(false);

    const skip = (page - 1) * limit;

    fetchProducts(
      { limit, skip, q: search, category, sortBy, order },
      abortControllerRef.current.signal,
    )
      .then((data) => {
        setProducts(data.products || []);
        setTotal(data.total || 0);
      })
      .catch((err) => {
        if (err.name !== "CanceledError" && err.code !== "ERR_CANCELED") {
          console.error("Fetch products error:", err);
          setError(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [page, limit, search, category, sortBy, order]);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      loadProducts();
    }
  }, [loadProducts]);

  // Handlers for Add/Edit/Delete
  const handleAddSubmit = async (formData) => {
    const newProd = await createProduct(formData);
    setProducts((prev) => [{ ...newProd, id: Date.now() }, ...prev]);
    setTotal((prev) => prev + 1);
  };

  const handleEditSubmit = async (formData) => {
    if (!editingProduct) return;
    const updated = await updateProduct(editingProduct.id, formData);
    setProducts((prev) =>
      prev.map((p) => (p.id === editingProduct.id ? { ...p, ...updated } : p)),
    );
  };

  const handleDeleteConfirm = async () => {
    if (!deletingProduct) return;
    await deleteProductById(deletingProduct.id);
    setProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id));
    setTotal((prev) => prev - 1);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Title + Add Button */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          </div>

          <button
            onClick={() => {
              setEditingProduct(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-medium text-sm rounded-md hover:bg-blue-700 transition self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>

        {/* Search & Filters Controls */}
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm mb-6 flex flex-wrap gap-4 items-center justify-between">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500"
            />
          </div>

          <select
            value={category}
            onChange={(e) => {
              setSearchTerm("");
              updateQueryParams({ category: e.target.value, page: 1, q: "" });
            }}
            className="px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-500 bg-white"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => {
              const name = typeof cat === "string" ? cat : cat.name || cat.slug;
              const slug = typeof cat === "string" ? cat : cat.slug || cat.name;
              return (
                <option key={slug} value={slug}>
                  {name}
                </option>
              );
            })}
          </select>
        </div>

        {/* Main Content Area */}
        {loading && (
          <div className="bg-white rounded-lg p-16 border border-gray-200 shadow-sm flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
            <p className="text-gray-600 font-medium">Loading products...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-white rounded-lg p-12 border border-gray-200 shadow-sm text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-800 mb-1">
              Failed to load products
            </h3>
            <button
              onClick={loadProducts}
              className="mt-4 inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white text-sm rounded-md"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="hidden md:block">
              <ProductTable
                products={products}
                onEdit={(p) => {
                  setEditingProduct(p);
                  setIsFormOpen(true);
                }}
                onDelete={(p) => setDeletingProduct(p)}
              />
            </div>
            <div className="block md:hidden">
              <ProductCards
                products={products}
                onEdit={(p) => {
                  setEditingProduct(p);
                  setIsFormOpen(true);
                }}
                onDelete={(p) => setDeletingProduct(p)}
              />
            </div>
          </>
        )}

        {/* Modals */}
        <ProductFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={editingProduct ? handleEditSubmit : handleAddSubmit}
          initialData={editingProduct}
        />

        <DeleteConfirmModal
          isOpen={!!deletingProduct}
          onClose={() => setDeletingProduct(null)}
          onConfirm={handleDeleteConfirm}
          productTitle={deletingProduct?.title || ""}
        />
      </main>
    </div>
  );
}

// --- 2. Default Export (Wraps ProductsContent with Suspense) ---
export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
