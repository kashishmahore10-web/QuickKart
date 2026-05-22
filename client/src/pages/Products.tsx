import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Home, SlidersHorizontal, ChevronDown } from 'lucide-react';
import API from '../config/api';
 import { Product } from '../types';
import Loading from '../components/loading';
import ProductCard from '../components/ProdutCard';
import FilterPanel from '../components/filterpanel';
import { categoriesData } from '../assets/assets';

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Get filter values from URL search params
  const category = searchParams.get('category') || '';
  const organic = searchParams.get('organic') || '';
  const sort = searchParams.get('sort') || '';
  const page = Number(searchParams.get('page')) || 1;
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.set('category', category);
      if (organic) params.set('organic', organic);
      if (sort) params.set('sort', sort);
      if (minPrice) params.set('minPrice', minPrice);
      if (maxPrice) params.set('maxPrice', maxPrice);
      params.set('page', page.toString());
      params.set('limit', '12');

      const { data } = await API.get(`/products?${params.toString()}`);
      setProducts(data.products);
      setTotalPages(data.pages || 1);
    } catch (error: any) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, organic, sort, page, minPrice, maxPrice]);

  const updateFilter = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    if (key !== 'page') {
      newParams.delete('page'); // Reset to page 1 on filter change
    }
    setSearchParams(newParams);
  };

  const clearFilter = () => {
    setSearchParams({});
  };

  const activeCategory = categoriesData.find((c) => c.slug === category);
  const hasFilters = category || organic || minPrice || maxPrice;

  return (
    <div className="min-h-screen bg-app-bg">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm mb-8">
          <a href="/" className="flex items-center gap-1 hover:text-app-green transition-colors">
            <Home className="size-4" />
          </a>
          <span className="text-gray-400">/</span>
          <span className="font-medium">
            {activeCategory ? activeCategory.name : 'All Products'}
          </span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar for Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="bg-white rounded-2xl border border-app-border p-6 sticky top-24">
              <FilterPanel
                categories={categoriesData}
                category={category}
                minPrice={minPrice}
                maxPrice={maxPrice}
                updateFilter={updateFilter}
                clearFilter={clearFilter}
                hasFilters={hasFilters}
              />
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="flex flex-col sm:flex-row justify-between items-start 
            sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  {activeCategory ? activeCategory.name : 'All Products'}
                </h1>
                <p className="text-sm text-gray-500">
                  {products.length} products found
                </p>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Mobile Filter Toggle */}
                <button
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden flex items-center justify-center gap-2 px-4 
                  py-2 bg-white border border-app-border rounded-xl text-sm font-medium flex-1"
                >
                  <SlidersHorizontal className="size-4" />
                  Filters
                </button>

                {/* Sort Dropdown */}
                <div className="relative flex-1 sm:flex-none">
                  <select
                    value={sort}
                    onChange={(e) => updateFilter('sort', e.target.value)}
                    className="appearance-none w-full bg-white border border-app-border 
                    rounded-xl px-4 py-2 pr-10 text-sm font-medium focus:outline-none focus:ring-2 
                    focus:ring-app-green/20"
                  >
                    <option value="">Newest</option>
                    <option value="price_low">Price: Low to High</option>
                    <option value="price_high">Price: High to Low</option>
                    <option value="rating">Top Rated</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-4 
                  text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <Loading />
            ) : products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-app-border">
                <p className="text-gray-900 font-medium mb-2">No products found</p>
                <p className="text-gray-500 text-sm mb-6">Try adjusting your filters or search terms.</p>
                <button
                  onClick={clearFilter}
                  className="bg-app-green text-white px-6 py-2 rounded-xl font-semibold hover:bg-opacity-90"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      updateFilter('page', (i + 1).toString());
                      window.scrollTo(0, 0);
                    }}
                    className={`size-10 rounded-xl font-medium transition-colors ${
                      page === i + 1
                        ? 'bg-app-green text-white shadow-lg shadow-app-green/20'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-app-border'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {mobileFilterOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-50 lg:hidden"
            onClick={() => setMobileFilterOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 bg-white rounded-t-3xl p-6 lg:hidden max-h-[85vh] overflow-y-auto animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronDown className="size-6 rotate-180" />
              </button>
            </div>
            <FilterPanel
              categories={categoriesData}
              category={category}
              minPrice={minPrice}
              maxPrice={maxPrice}
              updateFilter={updateFilter}
              clearFilter={clearFilter}
              hasFilters={hasFilters}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default Products;

