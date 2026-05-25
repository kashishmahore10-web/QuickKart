import React, { useEffect, useState } from 'react';
import API from '../../config/api';
import Loading from '../../components/Loading';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  AlertCircle, 
  Calendar,
  ArrowRight
} from 'lucide-react';
import { statusColors } from '../../assets/grocery-assets';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  // State for storing stats and managing loading UI
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch dashboard data from the backend
  const fetchStats = () => {
    API.get('/admin/stats')
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        toast.error(err.response?.data?.message || 'Failed to load stats');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchStats();
  }, []);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-8 p-4">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Monitor your store's performance at a glance.</p>
      </div>

      {/* Stats Grid: Displays 4 Key Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Orders */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ShoppingCart size={24}/></div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Orders</h3>
          <p className="text-2xl font-bold text-gray-900">{stats?.totalOrders}</p>
        </div>

        {/* Total Users */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-green-50 text-green-600 rounded-lg"><Users size={24}/></div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Users</h3>
          <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers}</p>
        </div>

        {/* Total Products */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Package size={24}/></div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Total Products</h3>
          <p className="text-2xl font-bold text-gray-900">{stats?.totalProducts}</p>
        </div>

        {/* Out of Stock Alert */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 bg-red-50 text-red-600 rounded-lg"><AlertCircle size={24}/></div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">Out of Stock</h3>
          <p className="text-2xl font-bold text-red-600">{stats?.outOfStock}</p>
        </div>
      </div>

      {/* Recent Orders Table Section */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-bold text-gray-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-app-green text-sm font-medium hover:underline flex items-center gap-1">
            View All <ArrowRight size={14} />
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Order ID</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Items</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stats?.recentOrders?.map((order: any) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    #{order.id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <div>{order.user?.name}</div>
                    <div className="text-gray-400 text-xs">{order.user?.email}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {order.items?.length} items
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    ${order.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-xs">
                    <span className={`px-2 py-1 rounded-full capitalize ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 flex items-center gap-1">
                    <Calendar size={14} />
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;