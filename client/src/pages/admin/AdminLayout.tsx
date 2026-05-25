import React from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Package, 
  ShoppingCart, 
  Users, 
  LogOut,
  Bike
} from 'lucide-react';

const AdminLayout = () => {
  // Access global user state from the AuthContext [3]
  const { user } = useAuth();
  const { pathname } = useLocation();

  // Route Guard: If the user is not an admin, redirect them to the homepage [4]
  if (!user?.isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Sidebar navigation items based on admin features [2, 5, 6]
  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Add Product', path: '/admin/products/new', icon: PlusCircle },
    { label: 'Product List', path: '/admin/products', icon: Package },
    { label: 'Orders', path: '/admin/orders', icon: ShoppingCart },
    { label: 'Delivery Partners', path: '/admin/delivery-partners', icon: Users },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Admin Sidebar Navigation [7] */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden lg:flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-2 text-app-green">
            <Bike size={28} />
            <span className="text-xl font-bold">Admin Panel</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                pathname === item.path
                  ? 'bg-app-green text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Exit Admin Panel Button [7, 8] */}
        <div className="p-4 border-t border-gray-100">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Admin Content Area [9] */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {/* Renders child components like AdminDashboard or AdminProducts [2] */}
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;