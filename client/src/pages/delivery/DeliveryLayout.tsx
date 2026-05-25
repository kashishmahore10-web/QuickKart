import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { Bike, LogOut, LayoutDashboard } from 'lucide-react';

const DeliveryLayout = () => {
  // State to store the delivery partner's information
  const [partner, setPartner] = useState<any>(null);
  const navigate = useNavigate();

  // Route Guard: Checks local storage for active session data [3]
  useEffect(() => {
    const saved = localStorage.getItem('delivery partner');
    const token = localStorage.getItem('delivery token');

    // If session data or token is missing, redirect to the delivery login page [3]
    if (!saved || !token) {
      navigate('/delivery/login');
      return;
    }

    // Restore partner data from local storage [4]
    setPartner(JSON.parse(saved));
  }, [navigate]);

  // Logout Handler: Clears the session and redirects [4]
  const handleLogout = () => {
    localStorage.removeItem('delivery token');
    localStorage.removeItem('delivery partner');
    setPartner(null);
    navigate('/delivery/login');
  };

  // Prevent layout flicker while checking authentication
  if (!partner) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Delivery Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Branding */}
            <Link to="/delivery" className="flex items-center gap-2 text-app-green">
              <Bike size={28} />
              <span className="text-xl font-bold">Partner Portal</span>
            </Link>

            <div className="flex items-center gap-4">
              {/* Partner Profile Indicator [5] */}
              <div className="flex items-center gap-2 text-gray-700">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-app-green font-bold border border-green-200">
                  {partner.name?.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:block text-sm font-semibold">{partner.name}</span>
              </div>

              {/* Logout Action [4] */}
              <button
                onClick={handleLogout}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors bg-gray-50 rounded-lg"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Dynamic Content Area */}
      <main className="flex-1 py-8 px-4">
        {/* Renders the child components, primarily the DeliveryDashboard [1, 6] */}
        <Outlet />
      </main>
    </div>
  );
};

export default DeliveryLayout;