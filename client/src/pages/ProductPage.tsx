import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Home, 
  ArrowLeft, 
  Leaf, 
  Star, 
  ShoppingBag, 
  Plus, 
  Minus, 
  ArrowRight 
} from 'lucide-react';
import API from '../config/api';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import Loading from '../components/Loading';
import ProductCard from '../components/ProductCard';
import { dummyReviewSection } from '../assets/grocery-assets';

const ProductPage = () => {
  const { id } = useParams(); // [2]
  const navigate = useNavigate(); // [2]
  const { items, addToCart, updateQuantity, removeFromCart } = useCart(); // [2]

  const [product, setProduct] = useState<Product | null>(null); // [3]
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]); // [3]
  const [loading, setLoading] = useState(true); // [3]
  const [localQuantity, setLocalQuantity] = useState(1); // [3]

  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '$'; // [1]

  useEffect(() => { // [4, 5]
    setLoading(true);
    setLocalQuantity(1);
    window.scrollTo(0, 0);

    // Fetch individual product details
    API.get(`/products/${id}`)
      .then((res) => {
        const productData = res.data.product;
        setProduct(productData);

        // Fetch related products in the same category [4, 6]
        return API.get(`/products?category=${productData.category}`);
      })
      .then((res) => {
        // Filter out the current product from related products [6]
        setRelatedProducts(res.data.products.filter((p: Product) => p.id !== id));
      })
      .catch(() => {
        navigate('/products'); // Redirect if product not found [6]
      })
      .finally(() => {
        setLoading(false); // [6]
      });
  }, [id, navigate]); // [5]

  if (loading) return <Loading />; // [7, 8]
  if (!product) return null; // [7]

  // Check if item is already in cart to sync quantities [7]
  const cartItem = items.find((item) => item.product.id === product.id);
  const inCart = !!cartItem;
  const displayQuantity = inCart ? cartItem.quantity : localQuantity;

  // Format category slug for display [9]
  const categoryLabel = product.category.replace(/-/g, ' ');

  const handleMinus = () => { // [10]
    if (inCart) {
      if (cartItem.quantity > 1) {
        updateQuantity(product._id, cartItem.quantity - 1);
      } else {
        removeFromCart(product._id);
      }
    } else {
      setLocalQuantity((prev) => Math.max(1, prev - 1));
    }
  };

  const handlePlus = () => { // [11]
    if (inCart) {
      updateQuantity(product.id, cartItem.quantity + 1);
    } else {
      setLocalQuantity((prev) => prev + 1);
    }
  };

  return (
    <div className="min-h-screen bg-app-bg pb-12">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumbs [9, 12] */}
        <nav className="flex items-center gap-2 text-sm mb-6 overflow-x-auto whitespace-nowrap">
          <Link to="/" className="flex items-center gap-1 hover:text-app-green transition-colors">
            <Home className="size-4" />
          </Link>
          <span className="text-gray-400">/</span>
          <Link to="/products" className="hover:text-app-green transition-colors">Products</Link>
          <span className="text-gray-400">/</span>
          <Link 
            to={`/products?category=${product.category}`} 
            className="capitalize hover:text-app-green transition-colors"
          >
            {categoryLabel}
          </Link>
          <span className="text-gray-400">/</span>
          <span className="font-medium text-gray-900 truncate max-w-[200px]">{product.name}</span>
        </nav>

        {/* Back Button [13] */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Back</span>
        </button>

        {/* Product Details Section [14, 15] */}
        <div className="bg-white rounded-3xl border border-app-border overflow-hidden mb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Left: Product Image & Badges [15-17] */}
            <div className="relative bg-gray-50 p-8 flex items-center justify-center min-h-[400px]">
              <img 
                src={product.image} 
                alt={product.name} 
                className="max-h-[350px] w-auto object-contain mix-blend-multiply" 
              />
              <div className="absolute top-6 left-6 flex flex-col gap-2">
                {product.isOrganic && (
                  <span className="bg-app-green/10 text-app-green px-3 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1">
                    <Leaf className="size-3" /> Organic
                  </span>
                )}
                {product.discount > 0 && (
                  <span className="bg-app-orange-dark text-white px-3 py-1.5 rounded-full text-xs font-semibold">
                    {product.discount}% OFF
                  </span>
                )}
              </div>
            </div>

            {/* Right: Info & Actions [18-27] */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <span className="text-app-green font-semibold text-sm uppercase tracking-wider mb-2">
                {categoryLabel}
              </span>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>
              
              {/* Ratings [19, 20] */}
              {product.rating > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-1">
                    {[28-32].map((star) => (
                      <Star 
                        key={star} 
                        className={`size-4 ${star <= Math.round(product.rating) ? 'fill-app-warning text-app-warning' : 'text-app-border'}`} 
                      />
                    ))}
                  </div>
                  <span className="text-sm font-medium">{product.rating} stars</span>
                  <span className="text-sm text-gray-400">({product.reviewCount} reviews)</span>
                </div>
              )}

              {/* Price [21, 22] */}
              <div className="flex items-baseline gap-3 mb-8">
                <span className="text-4xl font-bold text-app-green">{currency}{product.price.toFixed(2)}</span>
                {product.originalPrice > product.price && (
                  <span className="text-xl text-gray-400 line-through">
                    {currency}{product.originalPrice.toFixed(2)}
                  </span>
                )}
                <span className="text-gray-500 font-medium ml-1">/ {product.unit}</span>
              </div>

              <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

              {/* Stock Status [23, 24] */}
              <div className="mb-8">
                {product.stock > 0 ? (
                  <div className="flex items-center gap-2">
                    <span className="size-2 bg-app-success rounded-full animate-pulse"></span>
                    <span className="text-sm font-medium text-app-success">In Stock ({product.stock} available)</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="size-2 bg-red-500 rounded-full"></span>
                    <span className="text-sm font-medium text-red-500">Out of Stock</span>
                  </div>
                )}
              </div>

              {/* Quantity & Cart Actions [10, 11, 24-27, 33] */}
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-6 bg-gray-50 px-4 py-3 rounded-2xl border border-app-border">
                  <button onClick={handleMinus} className="p-1 hover:text-app-green transition-colors">
                    <Minus className="size-5" />
                  </button>
                  <span className="text-lg font-bold w-4 text-center">{displayQuantity}</span>
                  <button onClick={handlePlus} className="p-1 hover:text-app-green transition-colors">
                    <Plus className="size-5" />
                  </button>
                </div>
                
                <button 
                  disabled={product.stock === 0}
                  onClick={() => !inCart && addToCart(product, localQuantity)}
                  className={`flex-1 min-w-[200px] flex items-center justify-center gap-2 py-4 rounded-2xl font-bold transition-all shadow-lg ${
                    inCart 
                    ? 'bg-gray-100 text-gray-400 cursor-default shadow-none' 
                    : 'bg-app-green text-white hover:bg-opacity-90 shadow-app-green/20'
                  }`}
                >
                  <ShoppingBag className="size-5" />
                  {inCart ? 'Added to Cart' : 'Add to Cart'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Reviews Section [33] */}
        {product.reviewCount > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>
            {dummyReviewSection({ product })}
          </div>
        )}

        {/* Related Products Section [34-36] */}
        {relatedProducts.length > 0 && (
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Related Products</h2>
                <p className="text-gray-500 text-sm">More from {categoryLabel}</p>
              </div>
              <Link to={`/products?category=${product.category}`} className="flex items-center gap-1 text-app-green font-semibold hover:underline">
                View All <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
              {relatedProducts.slice(0, 5).map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;