import React, { useEffect, useState } from 'react';
import API from '../../config/api';
import { toast } from 'react-hot-toast';
import Loading from '../../components/Loading';
import { statusColors } from '../../assets/grocery-assets';
import { 
  Calendar, 
  Package, 
  User, 
  MapPin, 
  ChevronDown, 
  UserPlus, 
  X, 
  ExternalLink 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminOrders = () => {
  const [orders, setOrders] = useState<any[]>([]);
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [assignModal, setAssignModal] = useState<string | null>(null);
  const [selectedPartner, setSelectedPartner] = useState('');

  // Fetch all orders for the admin view [4]
  const fetchOrders = async () => {
    try {
      const { data } = await API.get('/admin/orders/all');
      setOrders(data.orders);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  // Fetch active delivery partners for assignment [5]
  const fetchPartners = async () => {
    try {
      const { data } = await API.get('/admin/delivery-partners');
      // Filter only active partners who can take new orders [5]
      const activePartners = data.partners.filter((p: any) => p.isActive);
      setPartners(activePartners);
    } catch (error: any) {
      console.error('Failed to load partners');
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchPartners();
  }, []);

  // Update order status (e.g., from placed to confirmed) [6]
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await API.put(`/admin/orders/${orderId}/status`, { status: newStatus });
      toast.success('Order status updated');
      fetchOrders(); // Refresh list to show updated status [7]
    } catch (error: any) {
      toast.error('Failed to update status');
    }
  };

  // Assign a delivery partner to an order [7]
  const handleAssign = async () => {
    if (!assignModal || !selectedPartner) return;

    try {
      await API.put(`/admin/orders/${assignModal}/assign`, { 
        partnerId: selectedPartner 
      });
      toast.success('Delivery partner assigned');
      setAssignModal(null);
      setSelectedPartner('');
      fetchOrders(); // Refresh list [8]
    } catch (error: any) {
      toast.error('Failed to assign partner');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
        <p className="text-gray-500 text-sm">View, track, and manage all store orders.</p>
      </div>

      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Order Header */}
            <div className="p-4 bg-gray-50/50 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Order ID</p>
                  <p className="font-medium text-gray-900">#{order.id.slice(-8).toUpperCase()}</p>
                </div>
                <div className="h-8 w-px bg-gray-200" />
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Date</p>
                  <div className="flex items-center gap-1 text-gray-900">
                    <Calendar size={14} />
                    <span className="text-sm">{new Date(order.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Status Dropdown [8] */}
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full capitalize outline-none cursor-pointer ${statusColors[order.status]}`}
                >
                  <option value="placed">Placed</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="assigned">Assigned</option>
                  <option value="packed">Packed</option>
                  <option value="out for delivery">Out for Delivery</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <Link to={`/orders/${order.id}`} className="p-2 text-gray-400 hover:text-app-green transition-colors">
                  <ExternalLink size={18} />
                </Link>
              </div>
            </div>

            {/* Order Body */}
            <div className="p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Customer & Address */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><User size={18}/></div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">{order.user?.name}</p>
                    <p className="text-xs text-gray-500">{order.user?.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><MapPin size={18}/></div>
                  <p className="text-xs text-gray-600 leading-relaxed">
                    {order.shippingAddress?.address}, {order.shippingAddress?.city}
                  </p>
                </div>
              </div>

              {/* Items Summary */}
              <div className="flex flex-wrap gap-2 items-center">
                {order.items?.slice(0, 4).map((item: any, idx: number) => (
                  <img key={idx} src={item.image} alt="" className="w-12 h-12 rounded-lg object-cover border border-gray-100" />
                ))}
                {order.items?.length > 4 && (
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                    +{order.items.length - 4}
                  </div>
                )}
              </div>

              {/* Assignment & Total */}
              <div className="flex flex-col justify-between items-end">
                <div className="text-right">
                  <p className="text-xs text-gray-500 font-medium">Total Amount</p>
                  <p className="text-lg font-bold text-app-green">${order.total.toFixed(2)}</p>
                </div>
                
                {order.deliveryPartner ? (
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">
                    <Package size={14} /> Assigned: {order.deliveryPartner.name}
                  </div>
                ) : (
                  <button 
                    onClick={() => setAssignModal(order.id)}
                    className="flex items-center gap-2 text-xs font-bold text-white bg-app-green px-4 py-2 rounded-lg hover:bg-opacity-90 transition-all"
                  >
                    <UserPlus size={14} /> Assign Partner
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Assignment Modal [7] */}
      {assignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Assign Delivery Partner</h2>
              <button onClick={() => setAssignModal(null)} className="text-gray-400 hover:text-gray-600"><X /></button>
            </div>
            
            {partners.length > 0 ? (
              <div className="space-y-4">
                <div className="grid gap-3">
                  {partners.map((partner) => (
                    <button
                      key={partner.id}
                      onClick={() => setSelectedPartner(partner.id)}
                      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                        selectedPartner === partner.id 
                        ? 'border-app-green bg-green-50' 
                        : 'border-gray-100 hover:border-gray-200'
                      }`}
                    >
                      <div className="text-left">
                        <p className="font-bold text-gray-900">{partner.name}</p>
                        <p className="text-xs text-gray-500 capitalize">{partner.vehicleType} • Active</p>
                      </div>
                      {selectedPartner === partner.id && <div className="w-4 h-4 rounded-full bg-app-green" />}
                    </button>
                  ))}
                </div>
                <button
                  disabled={!selectedPartner}
                  onClick={handleAssign}
                  className="w-full bg-app-green text-white py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  Confirm Assignment
                </button>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">No active delivery partners found.</p>
                <Link to="/admin/delivery-partners" className="text-app-green font-bold text-sm hover:underline mt-2 inline-block">
                  Onboard a partner first
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;