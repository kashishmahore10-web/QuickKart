import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../../config/api';
import { toast } from 'react-hot-toast';
import Loading from '../../components/Loading';
import { 
  PlusCircle, 
  Edit, 
  XCircle, 
  AlertCircle,
  Package 
} from 'lucide-react';

const AdminProducts = () => {
  // State for products list and loading status
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all products from the database via the Express API
  const fetchProducts = async () => {
    try {
      const { data } = await API.get('/products');
      setProducts(data.products);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /**
   * Instead of hard deleting products (which could break order histories), 
   * this function updates the product stock to zero.
   */
  const markOutOfStock = async (id: string) => {
    if (!window.confirm('Are you sure you want to mark this product as out of stock?')) return;

    try {
      // The backend 'delete' route is configured to update stock to 0
      await API.delete(`/products/${id}`);
      toast.success('Product marked as out of stock');
      fetchProducts(); // Refresh list to show updated stock status
    } catch (error: any) {
      toast.error('Failed to update product status');
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Management</h1>
          <p className="text-gray-500 text-sm">Monitor and manage your store inventory.</p>
        </div>
        <Link
          to="/admin/products/new"
          className="bg-app-green text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-opacity-90 transition-all"
        >
          <PlusCircle size={20} /> Add Product
        </Link>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 text-xs uppercase font-medium">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={product.image} 
                        alt={product.name} 
                        className="w-10 h-10 rounded-lg object-cover border border-gray-100" 
                      />
                      <span className="font-medium text-gray-900">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600 capitalize">
                    {product.category.replace('-', ' ')}
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {product.stock > 0 ? (
                      <span className="text-gray-600">
                        {product.stock} {product.unit} available
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 font-medium">
                        <AlertCircle size={14} /> Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/admin/products/${product.id}/edit`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit Product"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => markOutOfStock(product.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Mark as Out of Stock"
                      >
                        <XCircle size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {products.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <Package size={48} className="mx-auto mb-4 opacity-20" />
              <p>No products found in the database.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminProducts;
