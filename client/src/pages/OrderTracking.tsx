import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Phone } from 'lucide-react';
import API from '../config/api'; [4]
import { Order } from '../types'; [5]
import Loading from '../components/Loading'; [6]
import OrderOTP from '../components/OrderTracking/OrderOTP'
import LiveMap from '../components/OrderTracking/LiveMap'; [7]
import OrderTimeline from '../components/OrderTracking/OrderTimeLine'; [3]

const OrderTracking = () => {
  const { id } = useParams(); [1]
  const navigate = useNavigate(); [1]
  
  const [order, setOrder] = useState<Order | null>(null); [5]
  const [loading, setLoading] = useState(true); [5]
  const [liveLocation, setLiveLocation] = useState<{latitude: number, longitude: number} | null>(null); [5]
  
  const currency = import.meta.env.VITE_CURRENCY_SYMBOL || '$'; [8]

  // Initial Fetch of Order Details
  useEffect(() => { [4]
    API.get(`/orders/${id}`)
      .then((res) => {
        setOrder(res.data.order);
      })
      .catch(() => {
        navigate('/orders'); // Redirect if order not found
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, navigate]);

  // Polling for Live Location every 10 seconds if order is out for delivery
  useEffect(() => { [9, 10]
    if (!order || ['delivered', 'cancelled', 'placed'].includes(order.status)) return; [9]

    const fetchLocation = async () => { [11]
      try {
        const { data } = await API.get(`/orders/${id}/location`);
        if (data.liveLocation?.latitude && data.liveLocation?.longitude) {
          setLiveLocation({
            latitude: data.liveLocation.latitude,
            longitude: data.liveLocation.longitude
          });
        }
        // Update order status if it changed during polling
        if (data.status && data.status !== order.status) {
          setOrder((prev) => (prev ? { ...prev, status: data.status } : null));
        }
      } catch (err) {
        // Silent fail for polling errors
      }
    };

    fetchLocation();
    const interval = setInterval(fetchLocation, 10000); [10]
    return () => clearInterval(interval); [12]
  }, [id, order?.status]);

  if (loading) return <Loading />; [6]
  if (!order) return null; [13]

  return (
    <div className="min-h-screen bg-app-bg"> [13]
      <div className="max-w-7xl mx-auto px-4 py-8"> [13]
        
        {/* Header with Back Button */}
        <button 
          onClick={() => navigate('/orders')} 
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 mb-8 transition-colors"
        > [13]
          <ArrowLeft className="size-4" />
          <span>Back to Orders</span>
        </button>

        {/* Order ID and Status Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8"> [14]
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Order #{order.id.slice(-8).toUpperCase()}
            </h1> [14]
            <div className="flex items-center gap-2 text-gray-500 mt-1">
              <Calendar className="size-4" />
              <p className="text-sm">
                Placed on {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </p> [14]
            </div>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-sm font-bold capitalize ${
            order.status === 'delivered' ? 'bg-app-green/10 text-app-green' : 'bg-app-orange-dark/10 text-app-orange-dark'
          }`}> [15]
            {order.status}
          </span>
        </div>

        {/* Main Grid: Left Tracking, Right Order Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"> [16]
          
          {/* Left Side: Timeline and Tracking */}
          <div className="lg:col-span-2 space-y-6"> [16]
            
            {/* Delivery OTP Card (Visible if Out for Delivery) */}
            <OrderOTP order={order} /> [2]

            {/* Live Map Area */}
            <div className="bg-white rounded-3xl border border-app-border overflow-hidden"> [7]
              <LiveMap order={order} liveLocation={liveLocation} />
            </div>

            {/* Progress Timeline */}
            <div className="bg-white p-8 rounded-3xl border border-app-border"> [3]
              <h2 className="text-lg font-bold mb-8">Order Progress</h2>
              <OrderTimeline order={order} />
            </div>

            {/* Delivery Partner Details */}
            {order.deliveryPartner && order.status !== 'delivered' && order.status !== 'cancelled' && (
              <div className="bg-white p-6 rounded-3xl border border-app-border flex items-center justify-between"> [17]
                <div className="flex items-center gap-4">
                  <div className="size-12 bg-app-green text-white rounded-full flex items-center justify-center font-bold">
                    {order.deliveryPartner.name.charAt(0)}
                  </div> [18]
                  <div>
                    <p className="font-bold text-gray-900">{order.deliveryPartner.name}</p>
                    <p className="text-sm text-gray-500">{order.deliveryPartner.vehicleType} Partner</p> [18]
                  </div>
                </div>
                <a 
                  href={`tel:${order.deliveryPartner.phone}`} 
                  className="p-3 bg-app-green/10 text-app-green rounded-full hover:bg-app-green hover:text-white transition-all"
                > [19]
                  <Phone className="size-5" />
                </a>
              </div>
            )}
          </div>

          {/* Right Side: Order Summary Sidebar */}
          <div className="space-y-6"> [20]
            
            {/* Delivery Address */}
            <div className="bg-white p-6 rounded-3xl border border-app-border">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="size-4 text-app-green" />
                <h3 className="font-bold text-gray-900">Delivery Address</h3>
              </div> [20]
              <p className="text-sm text-gray-600 leading-relaxed">
                <span className="font-semibold">{order.shippingAddress.label}</span><br />
                {order.shippingAddress.address}<br />
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
              </p> [21]
            </div>

            {/* Items List */}
            <div className="bg-white p-6 rounded-3xl border border-app-border">
              <h3 className="font-bold text-gray-900 mb-6">Items ({order.items.length})</h3> [22]
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex items-center gap-3"> [22]
                    <img src={item.image} alt={item.name} className="size-12 rounded-xl object-cover" /> [23]
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p> [23]
                      <p className="text-xs text-gray-500">Qty: {item.quantity}</p> [23]
                    </div>
                    <span className="text-sm font-semibold">
                      {currency}{(item.price * item.quantity).toFixed(2)}
                    </span> [8]
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="mt-8 pt-6 border-t border-app-border space-y-3"> [24]
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="font-medium text-gray-900">{currency}{order.subtotal.toFixed(2)}</span>
                </div> [24]
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Delivery Fee</span>
                  <span className="text-app-success font-medium">
                    {order.deliveryFee === 0 ? 'Free' : `${currency}${order.deliveryFee.toFixed(2)}`}
                  </span> [25]
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tax</span>
                  <span className="font-medium text-gray-900">{currency}{order.tax.toFixed(2)}</span>
                </div> [26]
                <div className="flex justify-between text-base font-bold pt-3 border-t border-app-border">
                  <span>Total</span>
                  <span className="text-app-green">{currency}{order.total.toFixed(2)}</span>
                </div> [26]
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracking;
