import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, CreditCard, Check, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import API from '../config/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Address } from '../types';
import CheckoutAddress from '../components/Checkout/CheckoutAddress';
import CheckoutPayment from '../components/Checkout/CheckoutPayment';
import CheckoutReview from '../components/Checkout/CheckoutReview';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items, cartTotal, clearCart } = useCart();
  const [products, setProducts] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

  const [step, setStep] = useState('address'); // address, payment, review [1]
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card'); 
  // card, cash [2]
  
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '$';

  // Initialize address state with default values [3]
const [addresses, setAddresses] = useState<Address[]>([]);({
    
    label: 'Home',
    address: '',
    city: '',
    state: '',
    zip: '',
    isDefault: false,
    latitude: 0,
    longitude: 0
  });

  // Calculate order totals [2]
  const deliveryFee = cartTotal > 20 ? 0 : 1.99;
  const tax = cartTotal * 0.08;
  const total = cartTotal + deliveryFee + tax;

  // Define checkout progress steps [2, 4]
  const steps = [
    { key: 'address', label: 'Address', icon: MapPin },
    { key: 'payment', label: 'Payment', icon: CreditCard },
    { key: 'review', label: 'Review', icon: Check },
  ];

  // Populate address from user's default address on load [5, 6]
useEffect(() => {
  const fetchProducts = async () => {
    try {
      const response = await API.get(
        "/products?limit=10&sort=rating"
      );

      setProducts(response?.data?.products || []);
    } catch (error) {
      console.log(error);
      setProducts([]);
    }
  };

  fetchProducts();
}, []);
  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      // Prepare order data for API [7, 8]
      const orderData = {
        items: items.map(item => ({
          product: item.product._id,
          quantity: item.quantity
        })),
        shippingAddress: addresses,
        paymentMethod
      };

      const { data } = await API.post('/orders', orderData);

      // Handle Stripe online payment redirect [8]
      if (data.URL) {
        window.location.href = data.URL;
        return;
      }

      // Handle Cash on Delivery success [9]
      clearCart();
      toast.success('Order placed successfully');
      navigate(`/orders/${data.order.id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setLoading(false);
      window.scrollTo(0, 0);
    }
  };

  // UI for Empty Cart [10, 11]
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-app-bg flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Add some products to checkout</p>
          <button 
            onClick={() => navigate('/products')}
            className="bg-app-green text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-app-bg pb-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Header and Back Button [12] */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="size-4" />
          <span>Back</span>
        </button>
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        {/* Visual Progress Steps [13, 14] */}
        <div className="flex items-center gap-4 mb-12 overflow-x-auto pb-2">
          {steps.map((s, i) => (
            <React.Fragment key={s.key}>
              <button 
                onClick={() => setStep(s.key)}
                className={`flex items-center gap-2 shrink-0 transition-colors ${
                  step === s.key ? 'text-app-green font-bold' : 'text-gray-400 font-medium'
                }`}
              >
                <s.icon className="size-4" />
                <span className="text-sm">{s.label}</span>
              </button>
              {i < steps.length - 1 && (
                <ChevronRight className="size-4 text-gray-300 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Main Grid: Forms on left, Summary on right [14-17] */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2">
            {/* Conditional rendering of sub-components based on current step [15, 16] */}
            {step === 'address' && (
              <CheckoutAddress 
                address={addresses} 
                setAddress={setAddresses} 
                setStep={setStep} 
                user={user} 
              />
            )}
            {step === 'payment' && (
              <CheckoutPayment 
                paymentMethod={paymentMethod} 
                setPaymentMethod={setPaymentMethod} 
                setStep={setStep} 
              />
            )}
           {step === 'review' && selectedAddress && (
  <CheckoutReview
    address={selectedAddress}
    items={items}
    handlePlaceOrder={handlePlaceOrder}
    loading={loading}
    total={cartTotal}
  />
)}
          </div>

          {/* Order Summary Sidebar [17-20] */}
          <aside className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-app-border sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Order Summary</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal ({items.length} items)</span>
                  <span className="font-semibold text-gray-900">{currency}{cartTotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span className={deliveryFee === 0 ? 'text-app-success font-bold' : 'font-semibold text-gray-900'}>
                    {deliveryFee === 0 ? 'Free' : `${currency}${deliveryFee.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Estimated Tax (8%)</span>
                  <span className="font-semibold text-gray-900">{currency}{tax.toFixed(2)}</span>
                </div>

                <div className="pt-4 border-t border-app-border flex justify-between items-center">
                  <span className="text-base font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-app-green">{currency}{total.toFixed(2)}</span>
                </div>
              </div>

              <p className="mt-6 text-[10px] text-gray-400 text-center leading-relaxed">
                By placing your order, you agree to our Terms of Service and Privacy Policy.
              </p>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
};

export default Checkout;
