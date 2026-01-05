// src/features/marketplace/components/ProductFilters.tsx
import React from "react";
import { FilterOptions } from "../pages/MarketplacePage";

interface ProductFiltersProps {
  filters: FilterOptions;
  onFiltersChange: (newFilters: Partial<FilterOptions>) => void;
  onReset: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFiltersChange,
  onReset,
}) => {
  const categories = [
    "Food & Beverages",
    "Fashion & Accessories",
    "Art & Collectibles",
    "Home & Living",
    "Jewelry",
    "Books & Media",
  ];

  const availabilityOptions = ["in-stock", "limited", "out-of-stock"] as const;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Filters</h3>
        <button
          onClick={onReset}
          className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
        >
          Reset all
        </button>
      </div>

      {/* Categories */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">Categories</h4>
        <div className="space-y-2">
          {categories.map((category) => (
            <label key={category} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.categories.includes(category)}
                onChange={(e) => {
                  const newCategories = e.target.checked
                    ? [...filters.categories, category]
                    : filters.categories.filter((c) => c !== category);
                  onFiltersChange({ categories: newCategories });
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm">{category}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">Price Range</h4>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={filters.priceRange[0]}
            onChange={(e) => {
              const min = Number(e.target.value);
              onFiltersChange({ priceRange: [min, filters.priceRange[1]] });
            }}
            className="w-20 p-1 border rounded text-sm"
            placeholder="Min"
          />
          <span>-</span>
          <input
            type="number"
            value={filters.priceRange[1]}
            onChange={(e) => {
              const max = Number(e.target.value);
              onFiltersChange({ priceRange: [filters.priceRange[0], max] });
            }}
            className="w-20 p-1 border rounded text-sm"
            placeholder="Max"
          />
        </div>
      </div>

      {/* Rating */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">Minimum Rating</h4>
        <select
          value={filters.rating}
          onChange={(e) => onFiltersChange({ rating: Number(e.target.value) })}
          className="w-full p-2 border rounded text-sm"
        >
          <option value={0}>Any rating</option>
          <option value={4}>4+ stars</option>
          <option value={4.5}>4.5+ stars</option>
        </select>
      </div>

      {/* Availability */}
      <div className="mb-6">
        <h4 className="text-sm font-medium mb-2">Availability</h4>
        <div className="space-y-2">
          {availabilityOptions.map((status) => (
            <label key={status} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.availability.includes(status)}
                onChange={(e) => {
                  const newAvailability = e.target.checked
                    ? [...filters.availability, status]
                    : filters.availability.filter((s) => s !== status);
                  onFiltersChange({ availability: newAvailability });
                }}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm capitalize">
                {status.replace("-", " ")}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Made in Ethiopia */}
      <div className="mb-6">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.madeInEthiopia}
            onChange={(e) =>
              onFiltersChange({ madeInEthiopia: e.target.checked })
            }
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="ml-2 text-sm">Made in Ethiopia</span>
        </label>
      </div>
    </div>
  );
};

export default ProductFilters;
