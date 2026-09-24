"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import Navbar from "@/components/Navbar";
import { fetchProductById } from "@/lib/api/products";
import {
  ArrowLeft,
  Star,
  Package,
  ShieldCheck,
  Truck,
  Loader2,
  AlertCircle,
  UserCheck,
} from "lucide-react";

export default function ProductDetailPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id;

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Auth Guard
    const token = Cookies.get("token");
    if (!token) {
      router.push("/login");
      return;
    }

    if (!productId) return;

    setLoading(true);
    setError(false);

    fetchProductById(productId)
      .then((data) => {
        setProduct(data);
        setActiveImage(data.thumbnail || (data.images && data.images[0]) || "");
      })
      .catch((err) => {
        console.error("Failed to load product details", err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productId, router]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center space-x-2 text-sm font-medium text-gray-600 hover:text-blue-600 mb-6 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Products</span>
        </Link>

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-lg p-16 border border-gray-200 shadow-sm flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
            <p className="text-gray-600 font-medium">
              Loading product details...
            </p>
          </div>
        )}

        {/* Error / Not Found State */}
        {!loading && (error || !product) && (
          <div className="bg-white rounded-lg p-12 border border-gray-200 shadow-sm text-center max-w-lg mx-auto">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Product Not Found
            </h2>
            <p className="text-gray-600 mb-6 text-sm">
              The product you are looking for does not exist or may have been
              removed.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-medium text-sm rounded-md hover:bg-blue-700 transition"
            >
              Return to Dashboard
            </Link>
          </div>
        )}

        {/* Product Details Content */}
        {!loading && !error && product && (
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 lg:p-8">
              {/* Image Gallery Column */}
              <div>
                <div className="aspect-square bg-gray-50 border border-gray-200 rounded-lg overflow-hidden mb-4">
                  <img
                    src={activeImage}
                    alt={product.title}
                    className="w-full h-full object-contain p-4"
                  />
                </div>

                {/* Thumbnail selector */}
                {product.images && product.images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {product.images.map((imgUrl, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveImage(imgUrl)}
                        className={`w-16 h-16 rounded-md border-2 overflow-hidden flex-shrink-0 bg-gray-50 ${
                          activeImage === imgUrl
                            ? "border-blue-600"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`${product.title} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Info Column */}
              <div className="flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-800 uppercase tracking-wide">
                      {product.category}
                    </span>
                    <span className="text-xs text-gray-500 font-mono">
                      SKU: {product.sku || product.id}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
                    {product.title}
                  </h1>

                  <p className="text-gray-500 text-sm mb-4">
                    Brand:{" "}
                    <span className="font-medium text-gray-700">
                      {product.brand || "Generic"}
                    </span>
                  </p>

                  {/* Rating & Stock */}
                  <div className="flex items-center space-x-4 mb-6">
                    <div className="flex items-center space-x-1 bg-yellow-50 px-2.5 py-1 rounded border border-yellow-200">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold text-yellow-800">
                        {product.rating}
                      </span>
                    </div>

                    <span className="text-sm text-gray-600">
                      Stock:{" "}
                      <span className="font-semibold text-gray-800">
                        {product.stock} units
                      </span>
                    </span>
                  </div>

                  {/* Price Block */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <div className="flex items-baseline space-x-3">
                      <span className="text-3xl font-extrabold text-gray-900">
                        ${product.price}
                      </span>
                      {product.discountPercentage > 0 && (
                        <span className="text-sm text-green-600 font-semibold">
                          {product.discountPercentage}% OFF
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      Description
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {product.description}
                    </p>
                  </div>

                  {/* Extra Metadata Badges */}
                  <div className="grid grid-cols-2 gap-3 pt-4 border-t border-gray-100 text-xs text-gray-600">
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-blue-500" />
                      <span>
                        {product.shippingInformation || "Standard Shipping"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-green-500" />
                      <span>
                        {product.warrantyInformation || "1 Year Warranty"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-orange-500" />
                      <span>{product.returnPolicy || "30-Day Returns"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Customer Reviews Section */}
            {product.reviews && product.reviews.length > 0 && (
              <div className="border-t border-gray-200 bg-gray-50 p-6 lg:p-8">
                <h2 className="text-lg font-bold text-gray-900 mb-4">
                  Customer Reviews ({product.reviews.length})
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {product.reviews.map((rev, idx) => (
                    <div
                      key={idx}
                      className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3.5 h-3.5 ${
                                  i < rev.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-gray-400">
                            {new Date(rev.date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-gray-700 italic mb-3">
                          "{rev.comment}"
                        </p>
                      </div>

                      <div className="flex items-center space-x-1.5 text-xs text-gray-500 pt-2 border-t border-gray-100">
                        <UserCheck className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-medium text-gray-700">
                          {rev.reviewerName}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
