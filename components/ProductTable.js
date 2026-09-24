"use client";

import Link from "next/link";
import { Edit2, Trash2, Eye, Star } from "lucide-react";

export default function ProductTable({ products, onEdit, onDelete }) {
  return (
    <div className="hidden md:block overflow-x-auto bg-white rounded-lg border border-gray-200 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-600 uppercase tracking-wider">
            <th className="py-3 px-4">Image</th>
            <th className="py-3 px-4">Title</th>
            <th className="py-3 px-4">Category</th>
            <th className="py-3 px-4">Price</th>
            <th className="py-3 px-4">Rating</th>
            <th className="py-3 px-4">Stock</th>
            <th className="py-3 px-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-sm">
          {products.map((product) => (
            <tr key={product.id} className="hover:bg-gray-50 transition">
              <td className="py-3 px-4">
                <img
                  src={product.thumbnail || "https://picsum.photos/200"}
                  alt={product.title}
                  className="w-12 h-12 object-cover rounded border border-gray-200 bg-gray-50"
                />
              </td>
              <td className="py-3 px-4 font-medium text-gray-900 max-w-xs truncate">
                {product.title}
              </td>
              <td className="py-3 px-4 text-gray-600 capitalize">
                {product.category}
              </td>
              <td className="py-3 px-4 font-semibold text-gray-900">
                ${product.price}
              </td>
              <td className="py-3 px-4 text-gray-700">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{product.rating ?? 0}</span>
                </div>
              </td>
              <td className="py-3 px-4">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    product.stock > 10
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {product.stock ?? 0} left
                </span>
              </td>
              <td className="py-3 px-4 text-right space-x-2">
                <Link
                  href={`/products/${product.id}`}
                  className="inline-block p-1.5 text-gray-600 hover:text-blue-600 rounded hover:bg-blue-50 transition"
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </Link>
                <button
                  type="button"
                  onClick={() => onEdit?.(product)}
                  className="p-1.5 text-gray-600 hover:text-blue-600 rounded hover:bg-blue-50 transition"
                  title="Edit Product"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete?.(product)}
                  className="p-1.5 text-gray-600 hover:text-red-600 rounded hover:bg-red-50 transition"
                  title="Delete Product"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
