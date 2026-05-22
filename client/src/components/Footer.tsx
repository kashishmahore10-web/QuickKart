import {
  FaFacebookF,
  FaInstagram,
} from "react-icons/fa";

import {
  FaXTwitter,
  FaLocationDot,
} from "react-icons/fa6";

import {
  FiPhone,
  FiMail
} from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-[#042014] via-[#0a3828] to-[#042014] text-white">

      <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Logo & Description */}
          <div>
            <h2 className="text-3xl font-bold mb-6">
              🛒 QuickCart
            </h2>

            <p className="text-gray-300 leading-8">
              Bringing fresh, organic groceries straight
              from local farms to your doorstep.
              Nourish your home with Earth's finest.
            </p>

            <div className="flex gap-4 mt-8">

              <div className="bg-white/10 p-3 rounded-lg hover:bg-white/20 cursor-pointer">
                <FaFacebookF />
              </div>

              <div className="bg-white/10 p-3 rounded-lg hover:bg-white/20 cursor-pointer">
                <FaXTwitter />
              </div>

              <div className="bg-white/10 p-3 rounded-lg hover:bg-white/20 cursor-pointer">
                <FaInstagram />
              </div>

            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-6 uppercase">
              QUICK LINKS
            </h3>

            <ul className="space-y-5 text-gray-300">

              <li className="hover:text-white cursor-pointer">
                All Products
              </li>

              <li className="hover:text-white cursor-pointer">
                Flash Deals
              </li>

              <li className="hover:text-white cursor-pointer">
                Track Order
              </li>

              <li className="hover:text-white cursor-pointer">
                Delivery Partner
              </li>

            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="font-bold text-lg mb-6 uppercase">
              CUSTOMER SERVICE
            </h3>

            <ul className="space-y-5 text-gray-300">

              <li>My Account</li>
              <li>Order History</li>
              <li>Addresses</li>
              <li>Help Center</li>

            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-lg mb-6 uppercase">
              CONTACT US
            </h3>

            <div className="space-y-5 text-gray-300">

              <div className="flex gap-3">
                <FaLocationDot className="mt-1" />
                <p>123 Green Valley Rd, Portland</p>
              </div>

              <div className="flex gap-3">
                <FiPhone className="mt-1" />
                <p>+1 (111) 123-4567</p>
              </div>

              <div className="flex gap-3">
                <FiMail className="mt-1" />
                <p>hello@example.com</p>
              </div>

            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-white/10 mt-14 pt-8">

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-400">

            <p>
              © 2026 GreenStock. All rights reserved.
            </p>

            <div className="flex gap-6">

              <p className="cursor-pointer hover:text-white">
                Privacy Policy
              </p>

              <p className="cursor-pointer hover:text-white">
                Terms of Service
              </p>

            </div>

          </div>

        </div>

      </div>

    </footer>
  );
};

export default Footer;