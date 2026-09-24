"use client";

import Link from "next/link";
import { Eye, Edit2, Trash2, Star } from "lucide-react";

export default function ProductCards({ products, onEdit, onDelete }) {
  return (
    <div className="block md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm flex flex-col justify-between"
        >
          <div>
            <div className="flex items-start space-x-3 mb-3">
              <img
                src={product.thumbnail || "https://picsum.photos/200"}
                alt={product.title}
                className="w-16 h-16 object-cover rounded border border-gray-200 bg-gray-50 flex-shrink-0"
              />
              <div>
                <h3 className="font-bold text-gray-900 text-base leading-snug">
                  {product.title}
                </h3>
                <p className="text-xs text-gray-500 capitalize mt-0.5">
                  {product.category}
                </p>
                <div className="flex items-center space-x-1 mt-1 text-xs text-gray-700">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{product.rating ?? 0}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-2">
            <div>
              <span className="text-lg font-bold text-gray-900">
                ${product.price}
              </span>
              <span className="ml-2 text-xs text-gray-500">
                Stock: {product.stock ?? 0}
              </span>
            </div>

            <div className="flex space-x-1">
              <Link
                href={`/products/${product.id}`}
                className="p-2 text-gray-600 hover:text-blue-600 rounded hover:bg-blue-50"
                title="View Details"
              >
                <Eye className="w-4 h-4" />
              </Link>
              <button
                type="button"
                onClick={() => onEdit?.(product)}
                className="p-2 text-gray-600 hover:text-blue-600 rounded hover:bg-blue-50"
                title="Edit Product"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onDelete?.(product)}
                className="p-2 text-gray-600 hover:text-red-600 rounded hover:bg-red-50"
                title="Delete Product"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
