import React from "react";
import { NavLink } from "react-router-dom";
import { MapPin, Phone, Mail } from "lucide-react";
import { externalLinkProps, storeContact } from "@/config/contact";

const Footer = () => {
  return (
    <footer className="bg-red-600 text-white mt-10">
      
      {/* Main Footer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-6 md:px-16 py-10">
        
        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold mb-3">ALAM COMPUTER</h2>
          <p className="text-sm text-gray-200 leading-relaxed">
            Your trusted online computer store in UAE. We provide high-quality
            laptops, accessories, and IT products at competitive prices.
          </p>
        </div>

        {/* Shop Links */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Shop</h3>
          <ul className="space-y-2 text-sm">
            <li><NavLink to="/shop/home" className="hover:text-gray-200">Home</NavLink></li>
            <li><NavLink to="/shop/listing" className="hover:text-gray-200">All Products</NavLink></li>
            <li><NavLink to="/shop/listing?category=Laptop" className="hover:text-gray-200">Laptops</NavLink></li>
            <li><NavLink to="/shop/listing?category=Lcd" className="hover:text-gray-200">Monitors</NavLink></li>
            <li><NavLink to="/shop/listing?category=Printer" className="hover:text-gray-200">Printers</NavLink></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><NavLink to="/shop/about" className="hover:text-gray-200">About Us</NavLink></li>
            <li><NavLink to="/shop/contact" className="hover:text-gray-200">Contact</NavLink></li>
            <li><NavLink to="/faq" className="hover:text-gray-200">FAQs</NavLink></li>
            <li><NavLink to="/privacy-policy" className="hover:text-gray-200">Privacy Policy</NavLink></li>
            <li><NavLink to="/shop/checkout" className="hover:text-gray-200">Cart</NavLink></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact</h3>

          <div className="space-y-3 text-sm">
            <a
              href={storeContact.directionsHref}
              className="flex items-start gap-2 hover:text-gray-200"
              aria-label="Get directions to Alam Computer on Google Maps"
              {...externalLinkProps}
            >
              <MapPin className="w-4 h-4 mt-1" />
              <span>{storeContact.address}</span>
            </a>

            <a href={storeContact.phoneHref} className="flex items-center gap-2 hover:text-gray-200">
              <Phone className="w-4 h-4" />
              <span>{storeContact.phoneDisplay}</span>
            </a>

            <a href={storeContact.emailHref} className="flex items-center gap-2 hover:text-gray-200">
              <Mail className="w-4 h-4" />
              <span>{storeContact.email}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-red-400"></div>

      {/* Bottom Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-16 py-4 text-sm text-gray-200">
        <p>&copy; {new Date().getFullYear()} ALAM COMPUTER. All rights reserved.</p>

        <div className="flex gap-4 mt-2 md:mt-0">
          <NavLink to="/terms" className="hover:text-white">Terms</NavLink>
          <NavLink to="/privacy" className="hover:text-white">Privacy</NavLink>
          <NavLink to="/security" className="hover:text-white">Security</NavLink>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
