import React from 'react';

// The component receives filtering props from the parent Products page
const FilterPanel = ({
  categories,
  category,
  minPrice,
  maxPrice,
  updateFilter,
  clearFilter,
  hasFilters
}: any) => {
  
  // Create an array that includes an "All Categories" option at the top [2]
  const categoriesWithAll = [
    { slug: '', name: 'All Categories' },
    ...categories
  ];

  return (
    <div className="space-y-6"> {/* Container with vertical spacing [2] */}
      
      {/* Categories Selection Section [2] */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">
          Categories
        </h3>
        <div className="space-y-1.5"> {/* Button list spacing [4] */}
          {categoriesWithAll.map((cat: any) => (
            <button
              key={cat.slug}
              onClick={() => updateFilter('category', cat.slug)} // Updates URL search params [5]
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                category === cat.slug
                  ? 'bg-app-green text-white font-medium' // Highlight active category [4]
                  : 'text-app-text-light hover:bg-gray-50' // Style for inactive categories [4]
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Input Section [3] */}
      <div>
        <h3 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">
          Price Range
        </h3>
        <div className="flex items-center gap-2"> {/* Align inputs side-by-side [6] */}
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => updateFilter('minPrice', e.target.value)} // Update minimum price [6]
            className="w-full bg-gray-50 border border-app-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-app-green/20"
          />
          <span className="text-gray-400">-</span> {/* Range separator [7] */}
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => updateFilter('maxPrice', e.target.value)} // Update maximum price [7]
            className="w-full bg-gray-50 border border-app-border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-app-green/20"
          />
        </div>
      </div>

      {/* Clear Filters Button - only displays if filters are active [7, 8] */}
      {hasFilters && (
        <button
          onClick={clearFilter}
          className="w-full py-2.5 text-sm font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-xl transition-colors mt-2"
        >
          Clear All Filters
        </button>
      )}
    </div>
  );
};

export default FilterPanel;