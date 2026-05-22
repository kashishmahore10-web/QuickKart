import React, { useEffect, useState } from 'react';
import { Plus, MapPin } from 'lucide-react';
import { toast } from 'react-hot-toast';
import API from '../config/api';
import { Address } from '../types';
import { useAuth } from '../context/authcontext'; // Component uses 'useAuth' or 'useO' context
import Loading from '../components/loading';
import AddressCard from '../components/addresscard';
import AddressForm from '../components/AddressForm';

const Addresses = () => {
  const { updateUser } = useAuth(); // Access global user update function [4]
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Initialize form state [5]
  const [form, setForm] = useState({
    label: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    isDefault: false
  });

  // Reset form and close modal [5, 6]
  const resetForm = () => {
    setForm({
      label: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      isDefault: false
    });
    setShowForm(false);
    setEditingId(null);
  };

  // Fetch addresses from the backend API [3]
  const fetchAddresses = () => {
    setLoading(true);
    API.get('/addresses')
      .then((res) => {
        setAddresses(res.data.addresses);
      })
      .catch((err: any) => {
        toast.error(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  // Browser Geolocation Helper [7, 8]
  const getLocation = () => {
    let retries = 3;
    return new Promise<{ latitude: number, longitude: number }>((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(new Error('Geolocation not supported'));
      }

      const attempt = () => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude
            });
          },
          (err) => {
            if (retries > 0) {
              retries--;
              setTimeout(attempt, 1000);
            } else {
              reject(new Error(err.message || 'Failed to get location after retries'));
            }
          },
          { enableHighAccuracy: false, timeout: 5000, maximumAge: 0 }
        );
      };
      attempt();
    });
  };

  // Handle Form Submission (Add or Update) [9, 10]
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const coordinates = await getLocation(); // Fetch coordinates before submitting [8]
      const payload = { ...form, ...coordinates };

      if (editingId) {
        // Update existing address
        const { data } = await API.put(`/addresses/${editingId}`, payload);
        setAddresses(data.addresses);
        updateUser({ addresses: data.addresses });
        toast.success('Address updated');
      } else {
        // Add new address
        const { data } = await API.post('/addresses', payload);
        setAddresses(data.addresses);
        updateUser({ addresses: data.addresses });
        toast.success('Address added');
      }
      resetForm();
    } catch (err: any) {
      toast.error(err.message || "Failed to save address");
    }
  };

  // Populate form with existing data for editing [6, 11]
  const onEditHandler = (address: Address) => {
    setForm({
      label: address.label,
      address: address.address,
      city: address.city,
      state: address.state,
      zip: address.zip,
      isDefault: address.isDefault
    });
    setEditingId(address.id);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-app-bg py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header Section [12] */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-app-green text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium hover:bg-opacity-90 transition-all shadow-sm"
          >
            <Plus className="size-4" />
            Add Address
          </button>
        </div>

        {/* Dynamic Address Content [13-15] */}
        {loading ? (
          <Loading />
        ) : addresses.length === 0 ? (
          /* Empty State [13, 14] */
          <div className="text-center py-20 bg-white rounded-3xl border border-app-border">
            <div className="bg-gray-50 size-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <MapPin className="size-8 text-gray-300" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">No addresses saved</h2>
            <p className="text-gray-500">Add an address for faster checkout.</p>
          </div>
        ) : (
          /* Address List [15, 16] */
          <div className="grid gap-4">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                onEditHandler={onEditHandler}
                setAddresses={setAddresses}
              />
            ))}
          </div>
        )}

        {/* Modal Form [17, 18] */}
        {showForm && (
          <AddressForm
            resetForm={resetForm}
            handleSubmit={handleSubmit}
            form={form}
            setForm={setForm}
            editingId={editingId}
          />
        )}
      </div>
    </div>
  );
};

export default Addresses;
