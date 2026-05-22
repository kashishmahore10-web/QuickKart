import React, { useEffect, useState } from 'react';
import { Zap } from 'lucide-react';
import { toast } from 'react-hot-toast';
import {API} from '../config/api';
import { Product } from '../types';
import Loading from '../components/Loading';
import ProductCard from '../components/ProductCard';

const FlashDeals = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch flash deal products from the backend API
  useEffect(() => {
    API.get('/products/flash-deal')
      .then((response) => {
        setProducts(response.data.products);
      })
      .catch((error: any) => {
        toast.error(error.message || "Failed to load deals");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // Empty dependency array ensures this runs once on mount [1, 2]

  return (
    <div className="min-h-screen bg-app-bg">
      {/* Banner Section with Gradient Background */}
      <div className="bg-gradient-to-r from-app-orange-dark to-orange-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Zap className="size-8 fill-white" />
            <h1 className="text-4xl font-bold">Flash Deals</h1>
            <Zap className="size-8 fill-white" />
          </div>
          <p className="text-white/90 max-w-2xl mx-auto">
            Grab your favorite groceries at unbeatable prices. Limited time offers 
            on fresh produce, pantry staples, and more!
          </p>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <Loading /> // Displays while API request is pending [3, 4]
        ) : products.length === 0 ? (
          /* Empty State: No deals found */
          <div className="text-center py-20">
            <Zap className="size-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No deals right now</h2>
            <p className="text-gray-500">Check back later for exciting new offers!</p>
          </div>
        ) : (
          /* Product Grid: Displaying list of discounted products */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              // Only display product if it is in stock [5]
              product.stock > 0 && (
                <ProductCard key={product.id} product={product} />
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FlashDeals;