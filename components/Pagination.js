"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Pagination({
  currentPage,
  totalItems,
  limit,
  onPageChange,
  onLimitChange,
}) {
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  // Calculate range text (e.g., "Showing 21–40 of 194")
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalItems);

  return (
    <div className="bg-white px-4 py-3 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      {/* Range Display Text */}
      <div className="text-sm text-gray-700">
        Showing <span className="font-semibold">{startItem}</span>–
        <span className="font-semibold">{endItem}</span> of{" "}
        <span className="font-semibold">{totalItems}</span> products
      </div>

      <div className="flex items-center space-x-4">
        {/* Page Size Selector */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Per page:</span>
          <select
            value={limit}
            onChange={(e) => onLimitChange(Number(e.target.value))}
            className="border border-gray-300 rounded px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>

        {/* Previous & Next Buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white transition"
            aria-label="Previous Page"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>

          <span className="text-sm px-2 text-gray-700">
            Page <span className="font-semibold">{currentPage}</span> of{" "}
            <span className="font-semibold">{totalPages}</span>
          </span>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="p-1.5 border border-gray-300 rounded hover:bg-gray-100 disabled:opacity-40 disabled:hover:bg-white transition"
            aria-label="Next Page"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
