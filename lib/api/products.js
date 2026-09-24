import api from "./axios";

// Helper to get local products stored in browser
const getLocalProducts = () => {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem("custom_products") || "[]");
  } catch {
    return [];
  }
};

// Fetch products with search, pagination, category filter, and sorting
export const fetchProducts = async ({
  page = 1,
  limit = 10,
  search = "",
  category = "",
  sortBy = "",
  order = "asc",
  signal,
} = {}) => {
  const skip = (page - 1) * limit;

  let responseData;

  if (search.trim()) {
    const response = await api.get("/products/search", {
      params: { q: search.trim(), limit, skip, sortBy, order },
      signal,
    });
    responseData = response.data;
  } else if (category) {
    const response = await api.get(`/products/category/${category}`, {
      params: { limit, skip, sortBy, order },
      signal,
    });
    responseData = response.data;
  } else {
    const response = await api.get("/products", {
      params: { limit, skip, sortBy, order },
      signal,
    });
    responseData = response.data;
  }

  // Merge local custom products into the first page result
  const localProducts = getLocalProducts();
  if (page === 1 && localProducts.length > 0) {
    let filteredLocal = localProducts;

    if (search.trim()) {
      filteredLocal = filteredLocal.filter((p) =>
        p.title.toLowerCase().includes(search.trim().toLowerCase()),
      );
    }

    if (category) {
      filteredLocal = filteredLocal.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase(),
      );
    }

    responseData.products = [...filteredLocal, ...responseData.products];
  }

  return responseData;
};

// Fetch all categories for the filter dropdown
export const fetchCategories = async () => {
  const response = await api.get("/products/categories");
  return response.data;
};

// Fetch a single product by ID (Checks local storage first)
export const fetchProductById = async (id) => {
  const localProducts = getLocalProducts();
  const foundLocal = localProducts.find(
    (item) => String(item.id) === String(id),
  );

  if (foundLocal) {
    return foundLocal;
  }

  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Add product & save to local storage
export const createProduct = async (productData) => {
  const response = await api.post("/products/add", productData);
  const createdItem = {
    ...productData,
    ...response.data,
    id: `local-${Date.now()}`, // Unique ID for routing and deletion
  };

  const existing = getLocalProducts();
  localStorage.setItem(
    "custom_products",
    JSON.stringify([createdItem, ...existing]),
  );

  return createdItem;
};

// Update product
export const updateProduct = async (id, productData) => {
  if (String(id).startsWith("local-")) {
    const existing = getLocalProducts();
    const updated = existing.map((item) =>
      String(item.id) === String(id) ? { ...item, ...productData } : item,
    );
    localStorage.setItem("custom_products", JSON.stringify(updated));
    return { id, ...productData };
  }

  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

// Delete product
export const deleteProductById = async (id) => {
  if (String(id).startsWith("local-")) {
    const existing = getLocalProducts();
    const updated = existing.filter((item) => String(item.id) !== String(id));
    localStorage.setItem("custom_products", JSON.stringify(updated));
    return { id, isDeleted: true };
  }

  const response = await api.delete(`/products/${id}`);
  return response.data;
};
