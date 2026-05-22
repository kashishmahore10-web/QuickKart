import React from 'react';
import { useNavigate } from 'react-router-dom';
import { X, ShoppingBag, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

const CartSideBar = () => {
  const { 
    items, 
    updateQuantity, 
    removeFromCart, 
    cartTotal, 
    isCartOpen, 
    setIsCartOpen 
  } = useCart();
  
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '$';

  if (!isCartOpen) return null;

  const deliveryFee = cartTotal > 20 ? 0 : 1.99;
  const grandTotal = cartTotal + deliveryFee;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/40 z-50 transition-opacity" 
        onClick={() => setIsCartOpen(false)} 
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-app-border">
          <div className="flex items-center gap-2">
            <ShoppingBag className="size-5" />
            <h2 className="text-lg font-semibold">Your Cart</h2>
            <span className="bg-app-green/10 text-app-green px-2 py-0.5 rounded-full text-xs font-medium">
              {items.length} items
            </span>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)} 
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="bg-gray-50 p-6 rounded-full mb-4">
                <ShoppingBag className="size-16 text-gray-300" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500">Start shopping to see your orders here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product._id} className="flex gap-4">
                  <img 
                    src={item.product.image} 
                    alt={item.product.name} 
                    className="size-20 rounded-lg object-cover border border-app-border" 
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-semibold truncate">{item.product.name}</h4>
                    <p className="text-xs text-gray-500">
                      {currency}{item.product.price.toFixed(2)} / {item.product.unit}
                    </p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-3 bg-gray-50 px-2 py-1 rounded-lg">
                        <button 
                          onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                          className="p-1 hover:bg-white rounded-md transition-colors"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                          className="p-1 hover:bg-white rounded-md transition-colors"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold">
                          {currency}{(item.product.price * item.quantity).toFixed(2)}
                        </span>
                        <button 
                          onClick={() => removeFromCart(item.product._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-app-border bg-gray-50 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium">{currency}{cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Delivery</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-app-success font-medium">Free</span>
                  ) : (
                    `${currency}${deliveryFee.toFixed(2)}`
                  )}
                </span>
              </div>
              {deliveryFee > 0 && (
                <p className="text-[10px] text-gray-400 text-center">
                  Free delivery on orders over {currency}20
                </p>
              )}
            </div>
            
            <div className="flex justify-between text-base font-semibold border-t border-app-border pt-3">
              <span>Total</span>
              <span className="text-app-green">{currency}{grandTotal.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={() => {
                setIsCartOpen(false);
                navigate('/checkout');
                window.scrollTo(0, 0);
              }}
              className="w-full bg-app-green text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-colors shadow-lg shadow-app-green/20"
            >
              Proceed to Checkout
              <ArrowRight className="size-4" />
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSideBar;