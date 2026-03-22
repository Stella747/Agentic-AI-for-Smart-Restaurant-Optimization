import React from 'react';
import { Calendar, Star, MapPin } from 'lucide-react';

interface HeroProps {
  onReserveClick: () => void;
}

export default function Hero({ onReserveClick }: HeroProps) {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=1600)'
        }}
      >
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-4">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
          The Gourmet Grill
        </h1>
        <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto leading-relaxed">
          Experience culinary excellence in an atmosphere of refined elegance. 
          Where every meal becomes a memorable journey.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <div className="flex items-center space-x-2 text-amber-400">
            <Star className="fill-current" size={20} />
            <Star className="fill-current" size={20} />
            <Star className="fill-current" size={20} />
            <Star className="fill-current" size={20} />
            <Star className="fill-current" size={20} />
            <span className="ml-2 text-white">5.0 • 1,247 reviews</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-300">
            <MapPin size={20} />
            <span>Downtown • Fine Dining</span>
          </div>
        </div>

        <button
          onClick={onReserveClick}
          className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-amber-600 hover:to-orange-700 transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center space-x-2 mx-auto"
        >
          <Calendar size={20} />
          <span>Make a Reservation</span>
        </button>
      </div>

      {/* Floating Elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}