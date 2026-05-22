import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Package, Calendar, ChevronRight } from 'lucide-react';
import { toast } from 'react-hot-toast';
import API from '../config/api';
import { Order } from '../types';
import { useCart } from '../context/cartcontext';
import Loading from '../components/loading';
import { statusColors } from '../assets/assets';

const MyOrders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const { clearCart } = useCart();

  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '$';
  const tabs = ['all', 'placed', 'out for delivery', 'delivered'];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Filter by status if tab is not 'all'
      const params = activeTab !== 'all' ? `?status=${activeTab}` : '';
      const { data } = await API.get(`/orders${params}`);
      setOrders(data.orders);
    } catch (error: any) {
      toast.error(error.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If redirected from checkout with clearCart param, clear global cart state
    if (searchParams.get('clearCart')) {
      clearCart();
      setSearchParams({});
      // Small delay for backend processing
      setTimeout(() => fetchOrders(), 2000);
    } else {
      fetchOrders();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-app-bg py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

        {/* Status Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                activeTab === tab
                  ? 'bg-app-green text-white shadow-lg shadow-app-green/20'
                  : 'bg-white text-gray-500 hover:bg-gray-50 border border-app-border'
              }`}
            >
              {tab === 'all' ? 'All Orders' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Orders List */}
        {loading ? (
          <Loading />
        ) : orders.length === 0 ? (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-3xl border border-app-border">
            <div className="bg-gray-50 size-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="size-10 text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h2>
            <p className="text-gray-500 mb-8">Start shopping to see your orders here.</p>
            <Link 
              to="/products" 
              className="bg-app-green text-white px-8 py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          /* Order Grid */
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                to={`/orders/${order.id}`}
                className="block bg-white p-6 rounded-3xl border border-app-border hover:border-app-green/30 transition-all group"
              >
                {/* Header Row: ID, Date, Status */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
                  <div>
                    <p className="text-xs font-bold text-app-green uppercase tracking-wider mb-1">
                      Order #{order.id.slice(-8).toUpperCase()}
                    </p>
                    <div className="flex items-center gap-2 text-gray-500">
                      <Calendar className="size-4" />
                      <span className="text-sm">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className={`px-4 py-1.5 rounded-full text-xs font-bold capitalize ${
                      statusColors[order.status] || 'bg-gray-100 text-gray-700'
                    }`}>
                      {order.status}
                    </span>
                    <ChevronRight className="size-5 text-gray-300 group-hover:text-app-green transition-colors" />
                  </div>
                </div>

                {/* Items Thumbnails Row */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex -space-x-4">
                    {order.items.slice(0, 4).map((item, i) => (
                      <img
                        key={i}
                        src={item.image}
                        alt={item.name}
                        className="size-14 rounded-xl object-cover border-4 border-white bg-gray-50 shadow-sm"
                      />
                    ))}
                  </div>
                  {order.items.length > 4 && (
                    <span className="text-sm font-medium text-gray-400 ml-2">
                      +{order.items.length - 4} more items
                    </span>
                  )}
                </div>

                {/* Footer Row: Count and Price */}
                <div className="flex items-center justify-between pt-6 border-t border-app-border">
                  <span className="text-sm text-gray-500 font-medium">
                    {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                  </span>
                  <div className="text-right">
                    <p className="text-xs text-gray-400 mb-0.5">Total Amount</p>
                    <p className="text-lg font-bold text-gray-900">
                      {currency}{order.total.toFixed(2)}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;