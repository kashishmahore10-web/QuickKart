import { Routes, Route } from 'react-router-dom'; // [4, 5]
import { Toaster } from 'react-hot-toast'; // [4]

// User Pages
import Login from './pages/Login'; // [5]
import AppLayout from './pages/AppLayout'; // [6]
import Home from './pages/Home'; // [6]
import Products from './pages/Products'; // [6]
import ProductPage from './pages/ProductPage'; // [7]
import SearchResults from './pages/SearchResults'; // [7]
import FlashDeals from './pages/FlashDeals'; // [7]
import Checkout from './pages/Checkout'; // [8]
import MyOrders from './pages/MyOrders'; // [8]
import OrderTracking from './pages/OrderTracking'; // [8]
import Addresses from './pages/Addresses'; // [8]
import ProtectedRoute from './components/ProtectedRoute'; // [8, 9]

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout'; // [10, 11]
import AdminDashboard from './pages/admin/AdminDashboard'; // [11]
import AdminProducts from './pages/admin/AdminProducts'; // [11]
import AdminProductForm from './pages/admin/AdminProductForm'; // [11]
import AdminOrders from './pages/admin/AdminOrders'; // [12]
import AdminDeliveryPartners from "./pages/admin/AdminDeliveryPartners";

// Delivery Partner Pages
import DeliveryLogin from './pages/delivery/DeliveryLogin'; // [12]
import DeliveryLayout from './pages/delivery/DeliveryLayout'; // [12, 13]
import DeliveryDashboard from './pages/delivery/DeliveryDashboard'

const App = () => {
  return (
    <>
      {/* Toast notifications configuration [4] */}
      <Toaster 
        position="top-right" 
        toastOptions={{
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }} 
      />

      <Routes>
        {/* Authentication Pages (No Navbar/Footer) [5] */}
        <Route path="/login" element={<Login />} />

        {/* Main User Pages (With Navbar/Footer via AppLayout) [5, 6] */}
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Home />} />
          <Route path="products" element={<Products />} />
          <Route path="products/:id" element={<ProductPage />} />
          <Route path="search" element={<SearchResults />} />
          <Route path="deals" element={<FlashDeals />} />

          {/* Protected User Routes [7-9] */}
          <Route element={<ProtectedRoute />}>
            <Route path="checkout" element={<Checkout />} />
            <Route path="orders" element={<MyOrders />} />
            <Route path="orders/:id" element={<OrderTracking />} />
            <Route path="addresses" element={<Addresses />} />
          </Route>
        </Route>

        {/* Admin Panel Routes [10-12] */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="products/new" element={<AdminProductForm />} />
          <Route path="products/:id/edit" element={<AdminProductForm />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="delivery-partners" element={<AdminDeliveryPartners />} />
        </Route>

        {/* Delivery Partner Routes [12, 13] */}
        <Route path="/delivery/login" element={<DeliveryLogin />} />
        <Route path="/delivery" element={<DeliveryLayout />}>
          <Route index element={<DeliveryDashboard />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
