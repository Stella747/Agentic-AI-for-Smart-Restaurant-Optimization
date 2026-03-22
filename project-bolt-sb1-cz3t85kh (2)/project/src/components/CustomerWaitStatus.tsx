import React, { useState, useEffect } from 'react';
import { Clock, Users, Phone, CheckCircle, AlertCircle } from 'lucide-react';
import { WaitlistEntry, RestaurantStatus } from '../types';

export default function CustomerWaitStatus() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [waitlistEntry, setWaitlistEntry] = useState<WaitlistEntry | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  
  // Mock restaurant status
  const [restaurantStatus] = useState<RestaurantStatus>({
    isAcceptingWalkIns: true,
    averageWaitTime: 20,
    currentCapacity: 45,
    maxCapacity: 60,
    lastUpdated: new Date().toISOString()
  });

  // Mock waitlist data
  const mockWaitlist: WaitlistEntry[] = [
    {
      id: '1',
      name: 'Mike Johnson',
      phone: '+1 234 567 8902',
      partySize: 4,
      estimatedWait: 25,
      status: 'waiting',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      name: 'Emily Davis',
      phone: '+1 234 567 8903',
      partySize: 2,
      estimatedWait: 0,
      status: 'ready',
      timestamp: new Date().toISOString()
    }
  ];

  const checkWaitStatus = () => {
    setIsChecking(true);
    
    // Simulate API call
    setTimeout(() => {
      const entry = mockWaitlist.find(entry => 
        entry.phone.replace(/\D/g, '').includes(phoneNumber.replace(/\D/g, ''))
      );
      setWaitlistEntry(entry || null);
      setIsChecking(false);
    }, 1000);
  };

  const getStatusMessage = (status: WaitlistEntry['status'], estimatedWait: number) => {
    switch (status) {
      case 'waiting':
        return `Your table will be ready in approximately ${estimatedWait} minutes`;
      case 'ready':
        return 'Your table is ready! Please proceed to the host stand';
      case 'seated':
        return 'You have been seated. Enjoy your meal!';
      case 'cancelled':
        return 'Your reservation has been cancelled';
      default:
        return 'Status unknown';
    }
  };

  const getStatusIcon = (status: WaitlistEntry['status']) => {
    switch (status) {
      case 'waiting':
        return <Clock className="text-amber-500" size={24} />;
      case 'ready':
        return <CheckCircle className="text-green-500" size={24} />;
      case 'seated':
        return <Users className="text-blue-500" size={24} />;
      default:
        return <AlertCircle className="text-gray-500" size={24} />;
    }
  };

  return (
    <div className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Check Wait Status
          </h2>
          <p className="text-xl text-gray-600">
            Enter your phone number to check your table status and estimated wait time
          </p>
        </div>

        {/* Restaurant Status Banner */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                {restaurantStatus.isAcceptingWalkIns ? (
                  <CheckCircle className="text-green-500" size={32} />
                ) : (
                  <AlertCircle className="text-red-500" size={32} />
                )}
              </div>
              <p className="font-semibold text-gray-900">
                {restaurantStatus.isAcceptingWalkIns ? 'Accepting Walk-ins' : 'No Walk-ins'}
              </p>
              <p className="text-sm text-gray-600">Current Status</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Clock className="text-amber-500" size={32} />
              </div>
              <p className="font-semibold text-gray-900">{restaurantStatus.averageWaitTime} minutes</p>
              <p className="text-sm text-gray-600">Average Wait Time</p>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Users className="text-blue-500" size={32} />
              </div>
              <p className="font-semibold text-gray-900">
                {Math.round((restaurantStatus.currentCapacity / restaurantStatus.maxCapacity) * 100)}%
              </p>
              <p className="text-sm text-gray-600">Current Capacity</p>
            </div>
          </div>
        </div>

        {/* Phone Number Input */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="max-w-md mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone size={16} className="inline mr-2" />
              Phone Number
            </label>
            <div className="flex space-x-3">
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+1 234 567 8900"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <button
                onClick={checkWaitStatus}
                disabled={!phoneNumber || isChecking}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
              >
                {isChecking ? 'Checking...' : 'Check Status'}
              </button>
            </div>
          </div>
        </div>

        {/* Wait Status Result */}
        {waitlistEntry && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                {getStatusIcon(waitlistEntry.status)}
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Hello, {waitlistEntry.name}!
              </h3>
              
              <p className="text-lg text-gray-600 mb-6">
                {getStatusMessage(waitlistEntry.status, waitlistEntry.estimatedWait)}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-md mx-auto">
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Party Size</p>
                  <p className="text-xl font-bold text-gray-900">{waitlistEntry.partySize}</p>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-600">
                    {waitlistEntry.status === 'ready' ? 'Ready Now' : 'Estimated Wait'}
                  </p>
                  <p className="text-xl font-bold text-gray-900">
                    {waitlistEntry.status === 'ready' ? '0 min' : `${waitlistEntry.estimatedWait} min`}
                  </p>
                </div>
              </div>
              
              {waitlistEntry.status === 'ready' && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">
                    🎉 Your table is ready! Please proceed to the host stand with your party.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {waitlistEntry === null && phoneNumber && !isChecking && (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <AlertCircle className="text-gray-400 mx-auto mb-4" size={48} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No reservation found
            </h3>
            <p className="text-gray-600 mb-6">
              We couldn't find a reservation with that phone number. 
              Please check the number or speak with our host.
            </p>
            <button
              onClick={() => setPhoneNumber('')}
              className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors duration-200"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}