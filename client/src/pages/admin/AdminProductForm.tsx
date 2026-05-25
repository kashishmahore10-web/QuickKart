import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../config/api';
import { toast } from 'react-hot-toast';
import { Upload, Loader2, Package, Save } from 'lucide-react';
import Loading from '../../components/Loading';

const AdminProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id); // If ID exists in URL, we are in Edit Mode [2]

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    originalPrice: '',
    image: '',
    category: 'fruits-vegetables',
    unit: 'kg',
    stock: '',
    isOrganic: false,
  });

  // Fetch product data if in Edit Mode [5], [6]
  const fetchData = async () => {
    try {
      if (isEdit) {
        const { data } = await API.get(`/products/${id}`);
        const p = data.product;
        setFormData({
          name: p.name,
          description: p.description,
          price: String(p.price),
          originalPrice: String(p.originalPrice),
          image: p.image,
          category: p.category,
          unit: p.unit,
          stock: String(p.stock),
          isOrganic: p.isOrganic,
        });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let finalImageURL = formData.image;

      // Handle Image Upload if a new file was selected [3]
      if (imageFile) {
        const formDataUpload = new FormData();
        formDataUpload.append('image', imageFile);
        const { data } = await API.post('/upload', formDataUpload);
        finalImageURL = data.url;
      }

      if (!finalImageURL) {
        toast.error('Please upload a product image');
        setSaving(false);
        return;
      }

      // Prepare final payload with numeric conversions [4]
      const payload = {
        ...formData,
        image: finalImageURL,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice || 0),
        stock: Number(formData.stock),
      };

      if (isEdit) {
        // Update existing product [7]
        await API.put(`/products/${id}`, payload);
        toast.success('Product updated successfully');
      } else {
        // Create new product [7]
        await API.post('/products', payload);
        toast.success('Product created successfully');
      }

      navigate('/admin/products'); // Redirect to list after success [8]
    } catch (error: any) {
      toast.error('Failed to save product');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center gap-2 mb-8">
        <Package className="text-app-green" size={28} />
        <h1 className="text-2xl font-bold text-gray-900">
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Basics & Description */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-app-green outline-none"
                placeholder="e.g. Organic Bananas"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-app-green outline-none resize-none"
                placeholder="Describe the product..."
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">Inventory & Unit</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
                <select
                  value={formData.unit}
                  onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg outline-none"
                >
                  <option value="kg">kg</option>
                  <option value="g">gram</option>
                  <option value="lb">lb</option>
                  <option value="pack">Pack</option>
                  <option value="pcs">Piece</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input
                  required
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg outline-none"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isOrganic"
                checked={formData.isOrganic}
                onChange={(e) => setFormData({ ...formData, isOrganic: e.target.checked })}
                className="w-4 h-4 text-app-green rounded"
              />
              <label htmlFor="isOrganic" className="text-sm font-medium text-gray-700">
                This is an Organic Product
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Media & Pricing */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">Product Image</h3>
            <div className="relative group">
              <div className="aspect-square bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden">
                {imageFile || formData.image ? (
                  <img
                    src={imageFile ? URL.createObjectURL(imageFile) : formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <>
                    <Upload className="text-gray-400 mb-2" size={32} />
                    <p className="text-xs text-gray-500 text-center px-4">
                      Click or drag image to upload
                    </p>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="font-semibold text-gray-900 border-b pb-2">Pricing</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sale Price</label>
                <input
                  required
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Original Price</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg outline-none"
                />
              </div>
            </div>
          </div>

          <button
            disabled={saving}
            type="submit"
            className="w-full bg-app-green text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-opacity-90 transition-all shadow-md"
          >
            {saving ? (
              <Loader2 className="animate-spin" />
            ) : (
              <>
                <Save size={20} /> {isEdit ? 'Update Product' : 'Save Product'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;