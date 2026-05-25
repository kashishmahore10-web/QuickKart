import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../../config/api';
import { toast } from 'react-hot-toast';
import { Bike, Mail, Lock, Loader2 } from 'lucide-react';

const DeliveryLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Check if already logged in as a partner on component load [3]
  useEffect(() => {
    const token = localStorage.getItem('delivery token');
    if (token) {
      navigate('/delivery');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // API call to the delivery login endpoint [4]
      const { data } = await API.post('/delivery/login', { email, password });

      // Store delivery-specific session data in localStorage [2]
      localStorage.setItem('delivery token', data.token);
      localStorage.setItem('delivery partner', JSON.stringify(data.partner));

      toast.success('Login successful');
      navigate('/delivery'); // Redirect to delivery dashboard [3]
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        {/* Header Section [5] */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-green-50 rounded-full text-app-green mb-4">
            <Bike size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Partner Login</h1>
          <p className="text-gray-500 mt-2">Sign in to start managing your deliveries</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Input [5] */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-app-green outline-none"
                placeholder="partner@instacart.com"
              />
            </div>
          </div>

          {/* Password Input [5] */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-app-green outline-none"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Submit Button [3] */}
          <button
            disabled={loading}
            type="submit"
            className="w-full bg-app-green text-white py-3 rounded-xl font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-green-100"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'Login to Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default DeliveryLogin;