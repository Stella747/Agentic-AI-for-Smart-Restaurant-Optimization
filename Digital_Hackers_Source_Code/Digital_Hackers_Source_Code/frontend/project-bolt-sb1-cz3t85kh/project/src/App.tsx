import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import MenuSection from './components/MenuSection';
import ReservationForm from './components/ReservationForm';
import TableView from './components/TableView';
import StaffDashboard from './components/StaffDashboard';
import CustomerWaitStatus from './components/CustomerWaitStatus';
import Footer from './components/Footer';
import { Reservation } from './types';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [reservations, setReservations] = useState<Reservation[]>([]);

  const handleReservationSubmit = (reservationData: Omit<Reservation, 'id' | 'status'>) => {
    const newReservation: Reservation = {
      ...reservationData,
      id: `res-${Date.now()}`,
      status: 'confirmed',
    };
    setReservations(prev => [...prev, newReservation]);
  };

  const handleReserveClick = () => {
    setActiveSection('reservations');
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'home':
        return (
          <>
            <Hero onReserveClick={handleReserveClick} />
            <MenuSection />
          </>
        );
      case 'menu':
        return <MenuSection />;
      case 'reservations':
        return <ReservationForm onSubmit={handleReservationSubmit} />;
      case 'tables':
        return <TableView />;
      case 'staff':
        return (
          <div className="min-h-screen">
            <StaffDashboard />
          </div>
        );
      case 'wait-status':
        return <CustomerWaitStatus />;
      default:
        return (
          <>
            <Hero onReserveClick={handleReserveClick} />
            <MenuSection />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation activeSection={activeSection} onSectionChange={setActiveSection} />
      
      <main className="pt-16">
        {renderActiveSection()}
      </main>
      
      <Footer />
    </div>
  );
}

export default App;