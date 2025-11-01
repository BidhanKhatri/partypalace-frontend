import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Building2, TrendingUp, Calendar } from 'lucide-react';

const Dashboard = () => {
  const [dateRange] = useState('month');

  // Sample data
  const stats = [
    { label: 'Total Party Palaces', value: '24', icon: Building2, color: 'bg-blue-500' },
    { label: 'Active Party Palaces', value: '18', icon: Building2, color: 'bg-green-500' },
    { label: 'Total Revenue', value: '$45,230', icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'Bookings This Month', value: '156', icon: Calendar, color: 'bg-orange-500' },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 4000 },
    { month: 'Feb', revenue: 3000 },
    { month: 'Mar', revenue: 5000 },
    { month: 'Apr', revenue: 6500 },
    { month: 'May', revenue: 7200 },
    { month: 'Jun', revenue: 8100 },
  ];

  const bookingStatusData = [
    { name: 'Completed', value: 85, fill: '#10b981' },
    { name: 'Pending', value: 45, fill: '#f59e0b' },
    { name: 'Cancelled', value: 26, fill: '#ef4444' },
  ];

  const palaceData = [
    { name: 'Palace A', bookings: 24, revenue: 8500 },
    { name: 'Palace B', bookings: 19, revenue: 6200 },
    { name: 'Palace C', bookings: 28, revenue: 9100 },
    { name: 'Palace D', bookings: 15, revenue: 5300 },
    { name: 'Palace E', bookings: 22, revenue: 7800 },
  ];

  return (
    <section className="w-full min-h-screen bg-gray-50 p-4 md:p-8  h-screen overflow-y-auto flex-1">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your party palace overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg`}>
                    <Icon className="text-white" size={24} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Revenue Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#8b5cf6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Booking Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Status</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value})`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {bookingStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Palace Performance */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Palace Performance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={palaceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="bookings" fill="#3b82f6" name="Bookings" />
              <Bar yAxisId="right" dataKey="revenue" fill="#10b981" name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

export default Dashboard;