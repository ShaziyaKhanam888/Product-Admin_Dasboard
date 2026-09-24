"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import Navbar from "@/components/Navbar";
import Filters from "@/components/Filters";
import ProductTable from "@/components/ProductTable";
import ProductCards from "@/components/ProductCards";
import Pagination from "@/components/Pagination";
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
import { Loader2, RefreshCw, AlertCircle, Plus } from "lucide-react";

// Main Content Component
function ProductsContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);

  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const initialPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  const limitParam = parseInt(searchParams.get("limit") || "10", 10);
  const initialLimit = [10, 20, 50].includes(limitParam) ? limitParam : 10;

  const initialSearch = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "";
  const initialSortBy = searchParams.get("sortBy") || "";
  const initialOrder = searchParams.get("order") || "asc";

  const [searchInput, setSearchInput] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchInput, 400);

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const abortControllerRef = useRef(null);

  const updateQueryParams = useCallback(
    (newParams) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(newParams).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.set(key, String(value));
        } else {
          params.delete(key);
        }
      });

      router.push(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  useEffect(() => {
    fetchCategories()
      .then((data) => setCategories(data))
      .catch((err) => console.error("Failed to load categories", err));
  }, []);

  useEffect(() => {
    if (debouncedSearch !== initialSearch) {
      updateQueryParams({ q: debouncedSearch, page: 1 });
    }
  }, [debouncedSearch]);

  const loadProducts = useCallback(async () => {
    if (typeof window !== "undefined") {
      const token = Cookies.get("token");
      if (!token) {
        router.push("/login");
        return;
      }
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError("");

    try {
      const data = await fetchProducts({
        page: initialPage,
        limit: initialLimit,
        search: initialSearch,
        category: initialCategory,
        sortBy: initialSortBy,
        order: initialOrder,
        signal: controller.signal,
      });

      setProducts(data.products || []);
      setTotal(data.total || 0);
    } catch (err) {
      if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
        return;
      }
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [
    initialPage,
    initialLimit,
    initialSearch,
    initialCategory,
    initialSortBy,
    initialOrder,
    router,
  ]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleCategoryChange = (cat) => {
    updateQueryParams({ category: cat, page: 1, q: "" });
    setSearchInput("");
  };

  const handleSortByChange = (field) => {
    updateQueryParams({ sortBy: field, page: 1 });
  };

  const handleOrderChange = (ord) => {
    updateQueryParams({ order: ord, page: 1 });
  };

  const handlePageChange = (newPage) => {
    updateQueryParams({ page: newPage });
  };

  const handleLimitChange = (newLimit) => {
    updateQueryParams({ limit: newLimit, page: 1 });
  };

  const handleReset = () => {
    setSearchInput("");
    router.push(pathname);
  };

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
        <Filters
          searchQuery={searchInput}
          onSearchChange={setSearchInput}
          categories={categories}
          selectedCategory={initialCategory}
          onCategoryChange={handleCategoryChange}
          sortBy={initialSortBy}
          onSortByChange={handleSortByChange}
          order={initialOrder}
          onOrderChange={handleOrderChange}
          onReset={handleReset}
        />

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products</h1>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingProduct(null);
              setIsFormOpen(true);
            }}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-medium text-sm rounded-md hover:bg-blue-700 transition cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>

        {loading && (
          <div className="bg-white rounded-lg p-12 border border-gray-200 shadow-sm flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
            <p className="text-gray-600 font-medium">Loading products...</p>
          </div>
        )}

        {!loading && error && (
          <div className="bg-white rounded-lg p-8 border border-red-200 shadow-sm flex flex-col items-center justify-center text-center">
            <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              Error Loading Data
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={loadProducts}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retry</span>
            </button>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="bg-white rounded-lg p-12 border border-gray-200 shadow-sm text-center">
            <p className="text-gray-600 text-lg font-medium mb-1">
              No products found
            </p>
            <p className="text-gray-400 text-sm">
              Try adjusting your search query or filters.
            </p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
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
            <Pagination
              currentPage={initialPage}
              totalItems={total}
              limit={initialLimit}
              onPageChange={handlePageChange}
              onLimitChange={handleLimitChange}
            />
          </>
        )}

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

// Default export wrapped in Suspense for Next.js prerendering
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
