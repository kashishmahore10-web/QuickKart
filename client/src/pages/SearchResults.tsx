import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { Product } from '../types';
import API from '../config/api';
import { toast } from 'react-hot-toast';
import ProductCard from '../components/ProductCard';
import Loading from '../components/Loading';

const SearchResults = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || "";

  useEffect(() => {
    if (!query) return;

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        // Fetch products from backend filtering by search query
        const response = await API.get(`/products?search=${encodeURIComponent(query)}`);
        setProducts(response.data.products);
      } catch (error: any) {
        toast.error(error.message || "Failed to fetch search results");
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-app-bg">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Breadcrumbs Section */}
        <nav className="flex items-center gap-2 text-sm text-app-text-light mb-6">
          <Link to="/" className="hover:text-app-green flex items-center gap-1 transition-colors">
            <Home size={16} />
          </Link>
          <span>/</span>
          <span className="font-medium text-app-text">Search Results</span>
        </nav>

        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-app-text">
            Search results for "{query}"
          </h1>
          <p className="text-sm text-app-text-light mt-1">
            {loading ? "Searching..." : `${products.length} items found`}
          </p>
        </div>

        {/* Results Logic */}
        {loading ? (
          <Loading />
        ) : products.length === 0 ? (
          /* Empty State View */
          <div className="text-center py-20 bg-white rounded-2xl border border-app-border shadow-sm">
            <Search size={64} className="mx-auto text-app-border mb-4" />
            <h2 className="text-xl font-semibold text-app-text mb-2">No results found</h2>
            <p className="text-app-text-light mb-6">We couldn't find any products matching your search.</p>
            <Link 
              to="/products" 
              className="inline-flex items-center px-6 py-2 bg-app-green text-white rounded-lg hover:bg-app-green-dark transition-colors"
            >
              Browse all products
            </Link>
          </div>
        ) : (
          /* Product Results Grid */
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
