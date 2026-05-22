import React from 'react';
import { X } from 'lucide-react';

const AddressForm = ({ resetForm, handleSubmit, form, setForm, editingId }: any) => {
  return (
    <>
      {/* Overlay: Clicking this background will close the form */}
      <div 
        className="fixed inset-0 bg-black/40 z-50 transition-opacity" 
        onClick={resetForm} 
      />
      
      {/* Form Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={resetForm}>
        <form 
          onSubmit={handleSubmit}
          onClick={(e) => e.stopPropagation()} // Prevents form from closing when clicking inside it
          className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-xl animate-slide-up"
        >
          {/* Form Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-semibold text-gray-900">
              {editingId ? 'Edit Address' : 'Add New Address'}
            </h2>
            <button 
              type="button"
              onClick={resetForm} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="size-5" />
            </button>
          </div>

          {/* Form Input Fields Container */}
          <div className="space-y-5">
            {/* Address Label (Home, Work, etc.) */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Label
              </label>
              <input
                type="text"
                required
                placeholder="Home, Work etc."
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                className="w-full bg-gray-50 border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-app-green/20"
              />
            </div>

            {/* Street Address */}
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Street Address
              </label>
              <input
                type="text"
                required
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full bg-gray-50 border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-app-green/20"
              />
            </div>

            {/* City and State Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  City
                </label>
                <input
                  type="text"
                  required
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full bg-gray-50 border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-app-green/20"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  State
                </label>
                <input
                  type="text"
                  required
                  value={form.state}
                  onChange={(e) => setForm({ ...form, state: e.target.value })}
                  className="w-full bg-gray-50 border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-app-green/20"
                />
              </div>
            </div>

            {/* Zip Code and Default Checkbox Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                  Zip Code
                </label>
                <input
                  type="text"
                  required
                  value={form.zip}
                  onChange={(e) => setForm({ ...form, zip: e.target.value })}
                  className="w-full bg-gray-50 border border-app-border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-app-green/20"
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={form.isDefault}
                    onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                    className="size-4 rounded border-gray-300 text-app-green focus:ring-app-green/20 cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors">
                    Set as default
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit"
            className="w-full bg-app-green text-white py-4 rounded-2xl font-bold mt-8 hover:bg-opacity-90 transition-all shadow-lg shadow-app-green/20"
          >
            {editingId ? 'Update Address' : 'Save Address'}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddressForm;
