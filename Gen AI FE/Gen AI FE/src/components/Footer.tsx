import React from 'react';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Restaurant Info */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-xl font-bold">The Gourmet Grill</span>
            </div>
            <p className="text-gray-400 mb-4">
              Experience culinary excellence in an atmosphere of refined elegance. 
              Where every meal becomes a memorable journey.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors duration-200">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors duration-200">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-400 hover:text-amber-500 transition-colors duration-200">
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin size={18} className="text-amber-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">123 Gourmet Street</p>
                  <p className="text-gray-300">Downtown, NY 10001</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone size={18} className="text-amber-500 flex-shrink-0" />
                <p className="text-gray-300">+1 (555) 123-4567</p>
              </div>
              <div className="flex items-center space-x-3">
                <Mail size={18} className="text-amber-500 flex-shrink-0" />
                <p className="text-gray-300">reservations@thegourmetgrill.com</p>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Clock size={18} className="mr-2" />
              Hours
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Monday - Thursday</span>
                <span className="text-gray-300">5:00 PM - 10:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Friday - Saturday</span>
                <span className="text-gray-300">5:00 PM - 11:00 PM</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Sunday</span>
                <span className="text-gray-300">4:00 PM - 9:00 PM</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <a href="#" className="block text-gray-400 hover:text-amber-500 transition-colors duration-200">
                About Us
              </a>
              <a href="#" className="block text-gray-400 hover:text-amber-500 transition-colors duration-200">
                Private Dining
              </a>
              <a href="#" className="block text-gray-400 hover:text-amber-500 transition-colors duration-200">
                Events & Catering
              </a>
              <a href="#" className="block text-gray-400 hover:text-amber-500 transition-colors duration-200">
                Gift Cards
              </a>
              <a href="#" className="block text-gray-400 hover:text-amber-500 transition-colors duration-200">
                Careers
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400">
            © 2025 The Gourmet Grill. All rights reserved. | 
            <a href="#" className="text-amber-500 hover:text-amber-400 ml-1">Privacy Policy</a> | 
            <a href="#" className="text-amber-500 hover:text-amber-400 ml-1">Terms of Service</a>
          </p>
        </div>
      </div>
    </footer>
  );
}