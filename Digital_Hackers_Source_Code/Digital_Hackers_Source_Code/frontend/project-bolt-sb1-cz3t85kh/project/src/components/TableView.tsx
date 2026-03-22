import React, { useState, useEffect } from 'react';
import { tables as initialTables, reservations } from '../data/mockData';
import { Table } from '../types';
import { Users, Clock, Info } from 'lucide-react';

export default function TableView() {
  const [tables, setTables] = useState(initialTables);
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTables(prevTables => 
        prevTables.map(table => {
          // Randomly change some table statuses for demo
          if (Math.random() < 0.1) {
            const statuses: Table['status'][] = ['available', 'occupied', 'reserved'];
            const currentIndex = statuses.indexOf(table.status);
            const newStatus = statuses[(currentIndex + 1) % statuses.length];
            return { ...table, status: newStatus };
          }
          return table;
        })
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const getTableColor = (status: Table['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-500 hover:bg-green-600';
      case 'occupied':
        return 'bg-red-500 hover:bg-red-600';
      case 'reserved':
        return 'bg-amber-500 hover:bg-amber-600';
      case 'maintenance':
        return 'bg-gray-500 hover:bg-gray-600';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusIcon = (status: Table['status']) => {
    switch (status) {
      case 'available':
        return '✓';
      case 'occupied':
        return '●';
      case 'reserved':
        return '⚡';
      case 'maintenance':
        return '⚠';
      default:
        return '?';
    }
  };

  const getReservationInfo = (tableId: string) => {
    return reservations.find(res => res.tableId === tableId);
  };

  return (
    <div className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Live Table View
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Real-time restaurant table management and availability
          </p>
          
          {/* Legend */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[
              { status: 'available', label: 'Available', color: 'bg-green-500' },
              { status: 'occupied', label: 'Occupied', color: 'bg-red-500' },
              { status: 'reserved', label: 'Reserved', color: 'bg-amber-500' },
              { status: 'maintenance', label: 'Maintenance', color: 'bg-gray-500' },
            ].map(({ status, label, color }) => (
              <div key={status} className="flex items-center space-x-2">
                <div className={`w-4 h-4 rounded-full ${color}`}></div>
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Table Layout */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Users className="mr-2" size={24} />
                Restaurant Floor Plan
              </h3>
              
              <div className="relative bg-gray-100 rounded-xl p-8" style={{ height: '500px' }}>
                {/* Restaurant Layout Background */}
                <div className="absolute inset-4 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg opacity-50"></div>
                
                {tables.map((table) => (
                  <div
                    key={table.id}
                    onClick={() => setSelectedTable(table)}
                    className={`absolute w-16 h-16 rounded-lg ${getTableColor(table.status)} text-white font-bold cursor-pointer transform transition-all duration-200 hover:scale-110 shadow-lg flex flex-col items-center justify-center text-xs`}
                    style={{
                      left: `${table.x}px`,
                      top: `${table.y}px`,
                    }}
                  >
                    <span className="text-lg">{getStatusIcon(table.status)}</span>
                    <span>T{table.number}</span>
                    <span className="text-xs opacity-80">{table.seats}p</span>
                  </div>
                ))}
                
                {/* Kitchen and Bar Areas */}
                <div className="absolute bottom-4 left-4 w-32 h-20 bg-gray-300 rounded-lg flex items-center justify-center text-gray-700 font-semibold">
                  Kitchen
                </div>
                <div className="absolute top-4 right-4 w-20 h-32 bg-amber-200 rounded-lg flex items-center justify-center text-amber-800 font-semibold transform -rotate-90">
                  Bar
                </div>
              </div>
            </div>
          </div>

          {/* Table Details and Statistics */}
          <div className="space-y-6">
            {/* Table Details */}
            {selectedTable && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Info className="mr-2" size={20} />
                  Table {selectedTable.number} Details
                </h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className={`font-semibold capitalize ${
                      selectedTable.status === 'available' ? 'text-green-600' :
                      selectedTable.status === 'occupied' ? 'text-red-600' :
                      selectedTable.status === 'reserved' ? 'text-amber-600' :
                      'text-gray-600'
                    }`}>
                      {selectedTable.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Seats:</span>
                    <span className="font-semibold">{selectedTable.seats}</span>
                  </div>
                  
                  {selectedTable.status === 'reserved' && selectedTable.reservationId && (
                    <>
                      {(() => {
                        const reservation = getReservationInfo(selectedTable.id);
                        return reservation ? (
                          <div className="mt-4 p-4 bg-amber-50 rounded-lg">
                            <h4 className="font-semibold text-amber-800 mb-2">Reservation Details</h4>
                            <div className="space-y-1 text-sm">
                              <p><strong>Guest:</strong> {reservation.name}</p>
                              <p><strong>Time:</strong> {reservation.time}</p>
                              <p><strong>Guests:</strong> {reservation.guests}</p>
                              <p><strong>Phone:</strong> {reservation.phone}</p>
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Statistics */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <Clock className="mr-2" size={20} />
                Live Statistics
              </h3>
              
              <div className="space-y-4">
                {[
                  { label: 'Available Tables', value: tables.filter(t => t.status === 'available').length, color: 'text-green-600' },
                  { label: 'Occupied Tables', value: tables.filter(t => t.status === 'occupied').length, color: 'text-red-600' },
                  { label: 'Reserved Tables', value: tables.filter(t => t.status === 'reserved').length, color: 'text-amber-600' },
                  { label: 'Total Capacity', value: tables.reduce((sum, t) => sum + t.seats, 0), color: 'text-blue-600' },
                ].map((stat) => (
                  <div key={stat.label} className="flex justify-between items-center">
                    <span className="text-gray-600">{stat.label}:</span>
                    <span className={`font-bold text-xl ${stat.color}`}>{stat.value}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <div className="text-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {Math.round((tables.filter(t => t.status === 'occupied').length / tables.length) * 100)}%
                  </span>
                  <p className="text-sm text-gray-600">Occupancy Rate</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}