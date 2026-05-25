import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { 
  Truck, 
  MapPin, 
  Package, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  Phone, 
  Navigation,
  Clock,
  ChevronRight,
  X
} from 'lucide-react';
import Loading from '../../components/Loading';

// Backend API URL configuration [4]
const API_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000/api';

// Helper function to get delivery authentication headers [4]
const getOHeaders = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem('delivery token')}`
  }
});

const DeliveryDashboard = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'completed' [5, 6]
  const [tracking, setTracking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  // Modal states [7, 8]
  const [otpModal, setOtpModal] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [cancelModal, setCancelModal] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');

  const watchIdRef = useRef<number | null>(null); // Ref for geolocation watch [9, 10]

  // Fetch deliveries based on active tab [5, 11]
  const fetchOrders = async () => {
    try {
      const { data } = await axios.get(
        `${API_URL}/delivery/my-deliveries?status=${activeTab}`, 
        getOHeaders()
      );
      setOrders(data.orders);
    } catch (error: any) {
      toast.error('Failed to load deliveries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  // Real-time location sharing logic [6, 9, 10, 12, 13]
  useEffect(() => {
    const activeOrders = orders.filter(order => 
      ['assigned', 'packed', 'out for delivery'].includes(order.status)
    );

    if (activeOrders.length === 0 || !tracking) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
      return;
    }

    const sendLocation = (position: GeolocationPosition) => {
      const { latitude, longitude } = position.coords;
      activeOrders.forEach(order => {
        axios.put(
          `${API_URL}/delivery/my-deliveries/${order.id}/location`,
          { latitude, longitude },
          getOHeaders()
        ).catch(() => {}); // Silent catch for background updates
      });
    };

    // Watch position for continuous updates
    watchIdRef.current = navigator.geolocation.watchPosition(
      sendLocation,
      (err) => console.error(err),
      { enableHighAccuracy: true, maximumAge: 10000 }
    );

    // Backup interval for consistent updates every 10 seconds
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(sendLocation, () => {}, { enableHighAccuracy: true });
    }, 10000);

    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
      clearInterval(interval);
    };
  }, [orders, tracking]);

  // Handle status updates (Packed, Out for Delivery) [13-15]
  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      await axios.put(
        `${API_URL}/delivery/my-deliveries/${orderId}/status`,
        { status },
        getOHeaders()
      );
      toast.success(`Status updated to ${status}`);
      fetchOrders();
    } catch (error: any) {
      toast.error('Failed to update status');
    }
  };

  // Confirm delivery with customer OTP [3, 7]
  const handleComplete = async () => {
    if (!otpModal || !otp) return;
    setSubmitting(true);
    try {
      await axios.put(
        `${API_URL}/delivery/my-deliveries/${otpModal}/complete`,
        { OTP: otp },
        getOHeaders()
      );
      toast.success('Delivery completed successfully');
      setOtpModal(null);
      setOtp('');
      fetchOrders();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Invalid OTP');
    } finally {
      setSubmitting(false);
    }
  };

  // Handle order cancellation [3, 8]
  const handleCancel = async () => {
    if (!cancelModal) return;
    setSubmitting(true);
    try {
      await axios.put(
        `${API_URL}/delivery/my-deliveries/${cancelModal}/cancel`,
        { reason: cancelReason },
        getOHeaders()
      );
      toast.success('Delivery cancelled');
      setCancelModal(null);
      setCancelReason('');
      fetchOrders();
    } catch (error: any) {
      toast.error('Failed to cancel delivery');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header & Location Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Dashboard</h1>
          <p className="text-gray-500 text-sm">Manage your assigned orders and tracking.</p>
        </div>
        <button 
          onClick={() => setTracking(!tracking)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-bold transition-all ${tracking ? 'bg-red-50 text-red-600' : 'bg-app-green text-white shadow-lg shadow-green-200'}`}
        >
          <Navigation size={18} className={tracking ? 'animate-pulse' : ''} />
          {tracking ? 'Stop Sharing Location' : 'Share Live Location'}
        </button>
      </div>

      {/* Tabs [2, 6] */}
      <div className="flex gap-2 p-1 bg-gray-100 rounded-xl w-fit">
        {['active', 'completed'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2 rounded-lg text-sm font-bold capitalize transition-all ${activeTab === tab ? 'bg-white text-app-green shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            {tab} Deliveries
          </button>
        ))}
      </div>

      {/* Deliveries List [5] */}
      <div className="space-y-4">
        {orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
            <Truck size={48} className="mx-auto text-gray-200 mb-4" />
            <p className="text-gray-500">No {activeTab} deliveries found.</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-50 text-app-green rounded-lg"><Package size={20}/></div>
                  <span className="font-bold text-gray-900">Order #{order.id.slice(-8).toUpperCase()}</span>
                </div>
                <span className="text-xs font-bold px-3 py-1 bg-gray-100 text-gray-600 rounded-full uppercase">{order.status}</span>
              </div>
              
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="text-gray-400 mt-1" size={18} />
                    <p className="text-sm text-gray-600 leading-relaxed">{order.shippingAddress.address}, {order.shippingAddress.city}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CheckCircle className="text-gray-400" size={18} />
                    <p className="text-sm font-medium">{order.items.length} items • ${order.total.toFixed(2)} ({order.paymentMethod})</p>
                  </div>
                </div>

                {activeTab === 'active' && (
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    {order.status === 'assigned' && (
                      <button onClick={() => handleUpdateStatus(order.id, 'packed')} className="flex-1 md:flex-none px-4 py-2 bg-app-green text-white text-sm font-bold rounded-lg hover:bg-opacity-90">Mark Packed</button>
                    )}
                    {order.status === 'packed' && (
                      <button onClick={() => handleUpdateStatus(order.id, 'out for delivery')} className="flex-1 md:flex-none px-4 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-opacity-90">Out for Delivery</button>
                    )}
                    {order.status === 'out for delivery' && (
                      <button onClick={() => setOtpModal(order.id)} className="flex-1 md:flex-none px-4 py-2 bg-orange-500 text-white text-sm font-bold rounded-lg hover:bg-opacity-90">Mark Delivered</button>
                    )}
                    <button onClick={() => setCancelModal(order.id)} className="flex-1 md:flex-none px-4 py-2 border border-red-200 text-red-600 text-sm font-bold rounded-lg hover:bg-red-50">Cancel</button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* OTP Verification Modal [7] */}
      {otpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Verify Delivery</h2>
              <button onClick={() => setOtpModal(null)} className="text-gray-400"><X /></button>
            </div>
            <p className="text-sm text-gray-500 mb-4">Enter the 6-digit OTP provided by the customer to confirm delivery.</p>
            <input 
              type="text" 
              maxLength={6}
              value={otp} 
              onChange={(e) => setOtp(e.target.value)}
              className="w-full text-center text-2xl tracking-widest font-bold py-3 border-2 rounded-xl focus:border-app-green outline-none mb-4"
              placeholder="000000"
            />
            <button 
              disabled={submitting}
              onClick={handleComplete}
              className="w-full bg-app-green text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="animate-spin" /> : 'Confirm Delivery'}
            </button>
          </div>
        </div>
      )}

      {/* Cancellation Modal [8] */}
      {cancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-red-600">Cancel Delivery</h2>
              <button onClick={() => setCancelModal(null)} className="text-gray-400"><X /></button>
            </div>
            <textarea 
              value={cancelReason} 
              onChange={(e) => setCancelReason(e.target.value)}
              className="w-full p-4 border-2 rounded-xl focus:border-red-500 outline-none mb-4 resize-none"
              placeholder="Reason for cancellation..."
              rows={3}
            />
            <button 
              disabled={submitting}
              onClick={handleCancel}
              className="w-full bg-red-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="animate-spin" /> : 'Confirm Cancellation'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryDashboard;