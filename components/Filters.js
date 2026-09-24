"use client";

import { Search, RotateCcw } from "lucide-react";

export default function Filters({
  searchQuery,
  onSearchChange,
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortByChange,
  order,
  onOrderChange,
  onReset,
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between md:gap-4">
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products..."
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 md:flex md:items-center">
        {/* Category Filter */}
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full md:w-44 px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 capitalize"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => {
            // DummyJSON categories can be objects or strings
            const catSlug = typeof cat === "object" ? cat.slug : cat;
            const catName = typeof cat === "object" ? cat.name : cat;
            return (
              <option key={catSlug} value={catSlug}>
                {catName}
              </option>
            );
          })}
        </select>

        {/* Sort By Field */}
        <select
          value={sortBy}
          onChange={(e) => onSortByChange(e.target.value)}
          className="w-full md:w-36 px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Sort By</option>
          <option value="title">Title</option>
          <option value="price">Price</option>
          <option value="rating">Rating</option>
        </select>

        {/* Sort Order */}
        <select
          value={order}
          onChange={(e) => onOrderChange(e.target.value)}
          disabled={!sortBy}
          className="w-full md:w-28 px-3 py-2 border border-gray-300 rounded-md text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="flex items-center justify-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-md text-sm transition"
          title="Reset Filters"
        >
          <RotateCcw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>
    </div>
  );
}
