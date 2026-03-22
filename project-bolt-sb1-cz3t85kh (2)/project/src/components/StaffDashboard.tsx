import React, { useState, useEffect } from 'react';
import {
  Clock, Users, AlertCircle, CheckCircle, Phone, Edit3, Save, X,
  TrendingUp, DollarSign, Star, BarChart3, Brain, Lightbulb,
  ChefHat, CreditCard, Utensils, UserCheck, Timer, Settings,
  Search, Bell, User, Home, Menu as MenuIcon, Calendar,
  Mail, FileText, PieChart, Activity, ArrowUp, ArrowDown,
  Target, Zap, Coffee, Award
} from 'lucide-react';
import { Table, WaitlistEntry, RestaurantStatus, TableKPI, AIRecommendation, TableDetail } from '../types';
import { tables as initialTables } from '../data/mockData';
 
export default function StaffDashboard() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [tables, setTables] = useState<TableDetail[]>(
    initialTables.map(table => ({
      ...table,
      guestStatus: table.status === 'occupied' ? 'served' : 'waiting_to_seat',
      orderStatus: table.status === 'occupied' ? 'delivered' : undefined,
      seatedTime: table.status === 'occupied' ? new Date(Date.now() - Math.random() * 3600000).toISOString() : undefined,
      estimatedTurnTime: table.status === 'occupied' ? Math.floor(Math.random() * 60) + 30 : undefined,
      serverName: table.status === 'occupied' ? ['Alice', 'Bob', 'Carol', 'David'][Math.floor(Math.random() * 4)] : undefined,
      revenue: table.status === 'occupied' ? Math.floor(Math.random() * 200) + 50 : undefined,
    }))
  );
 
  const [waitlist, setWaitlist] = useState<WaitlistEntry[]>([
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
      estimatedWait: 15,
      status: 'ready',
      timestamp: new Date().toISOString()
    }
  ]);
 
  const [kpis] = useState<TableKPI>({
    totalRevenue: 12450,
    averageTurnTime: 85,
    occupancyRate: 78,
    customerSatisfaction: 4.7,
    totalCovers: 156,
    averageSpend: 79.80
  });
 
  const [aiRecommendations] = useState<AIRecommendation[]>([
    {
      id: '1',
      type: 'optimization',
      priority: 'high',
      title: 'Table 5 Optimization',
      description: 'Table 5 has been occupied for 95 minutes. Consider gentle check-in to optimize turnover.',
      action: 'Send server for check',
      timestamp: new Date().toISOString()
    },
    {
      id: '2',
      type: 'suggestion',
      priority: 'medium',
      title: 'Seating Strategy',
      description: 'Consider seating next 2-person party at Table 7 instead of Table 4 for better flow.',
      action: 'Update seating plan',
      timestamp: new Date().toISOString()
    }
  ]);
 
  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'reservations', label: 'Reservations', icon: Calendar },
    { id: 'tables', label: 'Table Management', icon: Users },
    { id: 'waitlist', label: 'Waitlist', icon: Clock },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'campaigns', label: 'Marketing', icon: Mail },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];
 
  const recentActivities = [
    { id: 1, type: 'reservation', message: 'New reservation added - Sarah Johnson', time: '2 min ago', icon: Calendar, color: 'text-blue-500' },
    { id: 2, type: 'table', message: 'Table 3 marked as available', time: '5 min ago', icon: CheckCircle, color: 'text-green-500' },
    { id: 3, type: 'order', message: 'Order delivered to Table 7', time: '8 min ago', icon: ChefHat, color: 'text-orange-500' },
    { id: 4, type: 'payment', message: 'Payment processed for Table 2', time: '12 min ago', icon: CreditCard, color: 'text-purple-500' },
    { id: 5, type: 'waitlist', message: 'Mike Johnson added to waitlist', time: '15 min ago', icon: Clock, color: 'text-amber-500' },
  ];
 
  const salesData = [
    { month: 'Jan', amount: 45000 },
    { month: 'Feb', amount: 52000 },
    { month: 'Mar', amount: 48000 },
    { month: 'Apr', amount: 61000 },
    { month: 'May', amount: 55000 },
    { month: 'Jun', amount: 67000 },
  ];
 
  const leadSources = [
    { source: 'Online Reservations', value: 45, color: 'bg-blue-500' },
    { source: 'Walk-ins', value: 30, color: 'bg-green-500' },
    { source: 'Phone Calls', value: 15, color: 'bg-orange-500' },
    { source: 'Referrals', value: 10, color: 'bg-purple-500' },
  ];
 
  const CircularProgress = ({ percentage, label, color = 'text-blue-500' }: { percentage: number; label: string; color?: string }) => {
    const circumference = 2 * Math.PI * 45;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
 
    return (
      <div className="flex flex-col items-center">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className={color}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold text-gray-700">{percentage}%</span>
          </div>
        </div>
        <span className="mt-2 text-sm font-medium text-gray-600">{label}</span>
      </div>
    );
  };
 
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900">${kpis.totalRevenue.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <ArrowUp className="text-green-500" size={16} />
                <span className="text-sm text-green-600 ml-1">+12.5% from last month</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="text-green-600" size={24} />
            </div>
          </div>
        </div>
 
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Table Turnover</p>
              <p className="text-3xl font-bold text-gray-900">{kpis.averageTurnTime}m</p>
              <div className="flex items-center mt-2">
                <ArrowDown className="text-green-500" size={16} />
                <span className="text-sm text-green-600 ml-1">5m faster than avg</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Timer className="text-blue-600" size={24} />
            </div>
          </div>
        </div>
 
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Occupancy Rate</p>
              <p className="text-3xl font-bold text-gray-900">{kpis.occupancyRate}%</p>
              <div className="flex items-center mt-2">
                <ArrowUp className="text-orange-500" size={16} />
                <span className="text-sm text-orange-600 ml-1">Above target</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <Users className="text-orange-600" size={24} />
            </div>
          </div>
        </div>
 
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Customer Rating</p>
              <p className="text-3xl font-bold text-gray-900">{kpis.customerSatisfaction}/5</p>
              <div className="flex items-center mt-2">
                <Star className="text-amber-500 fill-current" size={16} />
                <span className="text-sm text-amber-600 ml-1">Excellent rating</span>
              </div>
            </div>
            <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
              <Award className="text-amber-600" size={24} />
            </div>
          </div>
        </div>
      </div>
 
      {/* Charts and Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
 
 
        {/* Circular Progress Indicators */}
        {/* <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Performance Metrics</h3>
          <div className="space-y-6">
            <CircularProgress percentage={Math.round(kpis.customerSatisfaction * 20)} label="Customer Satisfaction" color="text-green-500" />
            <CircularProgress percentage={kpis.occupancyRate} label="Table Occupancy" color="text-blue-500" />
            <CircularProgress percentage={85} label="Staff Efficiency" color="text-purple-500" />
          </div>
        </div> */}
      </div>
 
      {/* Lead Sources and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Customer Sources */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Target className="mr-2" size={20} />
            Customer Sources
          </h3>
          <div className="space-y-4">
            {leadSources.map((source, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{source.source}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${source.color}`}
                      style={{ width: `${source.value}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-8">{source.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
 
        {/* Recent Activity Feed */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Activity className="mr-2" size={20} />
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => {
              const IconComponent = activity.icon;
              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center ${activity.color}`}>
                    <IconComponent size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
 
      {/* AI Recommendations */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <Brain className="mr-2 text-purple-600" size={20} />
          AI Restaurant Assistant
        </h3>
        <div className="space-y-4">
          {aiRecommendations.map((recommendation) => (
            <div key={recommendation.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <Lightbulb className="text-purple-600" size={16} />
                    <h4 className="font-semibold text-gray-900">{recommendation.title}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      recommendation.priority === 'high' ? 'bg-red-100 text-red-800' :
                      recommendation.priority === 'medium' ? 'bg-amber-100 text-amber-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {recommendation.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{recommendation.description}</p>
                  {recommendation.action && (
                    <button className="text-sm bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 transition-colors">
                      {recommendation.action}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
 
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">G</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">The Gourmet Grill</h1>
              <p className="text-xs text-gray-500">Staff Dashboard</p>
            </div>
          </div>
        </div>
 
        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {sidebarItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === item.id
                      ? 'bg-amber-50 text-amber-700 border border-amber-200'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <IconComponent size={18} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
 
        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User size={16} className="text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Restaurant Manager</p>
              <p className="text-xs text-gray-500">manager@gourmetgrill.com</p>
            </div>
          </div>
        </div>
      </div>
 
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search tables, reservations, customers..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings size={20} />
              </button>
              <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                <span className="text-white font-medium text-sm">JD</span>
              </div>
            </div>
          </div>
        </header>
 
        {/* Page Content */}
        <main className="flex-1 p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 capitalize">{activeSection}</h2>
            <p className="text-gray-600">Manage your restaurant operations efficiently</p>
          </div>
          
          {activeSection === 'dashboard' && renderDashboard()}
          {activeSection !== 'dashboard' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
              <Coffee className="mx-auto text-gray-400 mb-4" size={48} />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)} Section
              </h3>
              <p className="text-gray-600">This section is under development. Coming soon!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
 