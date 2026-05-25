import React, { useEffect, useState } from 'react';
import API from '../../config/api';
import { toast } from 'react-hot-toast';
import { 
  UserPlus, 
  Mail, 
  Phone, 
  Truck, 
  ShieldCheck, 
  ShieldAlert, 
  Loader2,
  X
} from 'lucide-react';
import Loading from '../../components/Loading';

const AdminDeliveryPartners = () => {
  const [partners, setPartners] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Form state for onboarding new partners
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    vehicleType: 'bike'
  });

  // Fetch partners from the database
  const fetchPartners = async () => {
    try {
      const { data } = await API.get('/admin/delivery-partners');
      setPartners(data);
    } catch (error: any) {
      toast.error('Failed to load partners');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  // Handle new partner submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await API.post('/admin/delivery-partners', form);
      toast.success('Partner onboarded successfully');
      setShowForm(false);
      setForm({ name: '', email: '', password: '', phone: '', vehicleType: 'bike' });
      fetchPartners(); // Refresh the list
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to onboard partner');
    } finally {
      setSaving(false);
    }
  };

  // Toggle partner active/inactive status
  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      await API.put(`/admin/delivery-partners/${id}`, { isActive: !currentStatus });
      toast.success(currentStatus ? 'Partner deactivated' : 'Partner activated');
      fetchPartners();
    } catch (error: any) {
      toast.error('Failed to update status');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Delivery Partners</h1>
          <p className="text-gray-500 text-sm">Manage your delivery fleet and availability.</p>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-app-green text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-90"
        >
          <UserPlus size={20} /> Add Partner
        </button>
      </div>

      {/* Partners List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner) => (
          <div key={partner.id} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-gray-50 rounded-full text-app-green">
                <Truck size={24} />
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${partner.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {partner.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 text-lg">{partner.name}</h3>
            <div className="mt-4 space-y-2 text-sm text-gray-600">
              <div className="flex items-center gap-2"><Mail size={16} /> {partner.email}</div>
              <div className="flex items-center gap-2"><Phone size={16} /> {partner.phone}</div>
              <div className="flex items-center gap-2 capitalize"><Truck size={16} /> {partner.vehicleType}</div>
            </div>
            <button 
              onClick={() => toggleActive(partner.id, partner.isActive)}
              className={`w-full mt-6 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${partner.isActive ? 'border border-red-200 text-red-600 hover:bg-red-50' : 'bg-app-green text-white hover:bg-opacity-90'}`}
            >
              {partner.isActive ? <><ShieldAlert size={16} /> Deactivate</> : <><ShieldCheck size={16} /> Activate</>}
            </button>
          </div>
        ))}
      </div>

      {/* Onboarding Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <div className="bg-white rounded-xl w-full max-w-md p-6 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">New Delivery Partner</h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600"><X /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input required type="text" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-app-green outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input required type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-app-green outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input required type="password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-app-green outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input required type="text" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-app-green outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                <select value={form.vehicleType} onChange={(e) => setForm({...form, vehicleType: e.target.value})} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-app-green outline-none">
                  <option value="bike">Bike</option>
                  <option value="scooter">Scooter</option>
                  <option value="car">Car</option>
                </select>
              </div>
              <button disabled={saving} type="submit" className="w-full bg-app-green text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 disabled:opacity-50">
                {saving ? <Loader2 className="animate-spin" /> : 'Create Partner'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDeliveryPartners;