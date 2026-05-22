import React from 'react'; // Note: Passage [4] mentions removing this if unused
import { MapPin, Pencil, Trash2, Check } from 'lucide-react';
import API from '../config/api';
import { Address } from '../types';
import { useAuth } from '../context/authcontext';
import { toast } from 'react-hot-toast';

interface AddressCardProps {
  address: Address;
  onEditHandler: (address: Address) => void;
  setAddresses: React.Dispatch<React.SetStateAction<Address[]>>;
}

const AddressCard = ({ address, onEditHandler, setAddresses }: AddressCardProps) => {
  const { updateUser } = useAuth(); // Access global user state update [5]

  // Handler to delete an individual address [6, 7]
  const handleDelete = async (id: string) => {
    try {
      const confirm = window.confirm("Are you sure you want to delete this address?"); [7]
      if (!confirm) return;

      const { data } = await API.delete(`/addresses/${id}`); [7]
      
      // Update local state and global context with the new list from backend [5]
      setAddresses(data.addresses); 
      updateUser({ addresses: data.addresses });
      toast.success('Address removed'); [5]
    } catch (error: any) {
      toast.error(error.message || "Failed to remove address"); [5]
    }
  };

  return (
    <div key={address._id} className="max-w-4xl bg-white rounded-2xl border border-app-border p-5 flex justify-between items-start"> [2]
      
      {/* Left Side: Icon and Address Details [2, 8] */}
      <div className="flex gap-4">
        <div className="size-10 bg-app-green/10 rounded-full flex items-center justify-center shrink-0"> [2]
          <MapPin className="size-5 text-app-green" /> [2]
        </div>
        
        <div>
          <div className="flex items-center gap-3 mb-1"> [8]
            <p className="font-semibold text-gray-900 capitalize">{address.label}</p> [8]
            
            {/* Default Badge - Shown only if address is marked default [9] */}
            {address.isDefault && (
              <span className="flex items-center gap-1 bg-app-green/10 text-app-green px-2 py-0.5 rounded-full text-[10px] font-bold"> [9]
                <Check className="size-2.5" /> [9]
                Default
              </span>
            )}
          </div>

          {/* Formatted Address with a line break after the city [8] */}
          <p className="text-sm text-gray-500 leading-relaxed"> [9]
            {address.address},<br /> [8]
            {address.city}, {address.state} {address.zip} [8]
          </p>
        </div>
      </div>

      {/* Right Side: Action Buttons [3, 10] */}
      <div className="flex items-center gap-2"> [10]
        <button 
          onClick={() => onEditHandler(address)} // Opens the edit form [3]
          className="p-2 text-gray-400 hover:text-app-green hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Pencil className="size-4" /> [10]
        </button>
        
        <button 
          onClick={() => handleDelete(address.id)} // Triggers delete logic [3]
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="size-4" /> [3]
        </button>
      </div>
    </div>
  );
};

export default AddressCard;