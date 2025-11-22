import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Building2, TrendingUp, Calendar } from "lucide-react";
import api from "../utils/apiInstance";

const Dashboard = () => {
  const [stats, setStats] = useState([]);
  const [bookingStatusData, setBookingStatusData] = useState([]);
  const [palaceData, setPalaceData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Colors for booking status chart
  const statusColors = {
    Pending: "#f59e0b",
    Confirmed: "#10b981",
    Cancelled: "#ef4444",
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await api.get("api/admin/dashboard");
      const data = res.data;

      // Map stats to match original dummy structure
      const statsArray = [
        {
          label: "Total Party Palaces",
          value: data.stats.totalPalaces,
          icon: Building2,
          color: "bg-blue-500",
        },
        {
          label: "Active Party Palaces",
          value: data.stats.activePalaces,
          icon: Building2,
          color: "bg-green-500",
        },
        {
          label: "Total Revenue",
          value: `Rs ${data.stats.totalRevenue}`,
          icon: TrendingUp,
          color: "bg-purple-500",
        },
        {
          label: "Bookings This Month",
          value: data.stats.monthlyBookings,
          icon: Calendar,
          color: "bg-orange-500",
        },
      ];

      // Format booking status for PieChart
      const bookingStatusFormatted = data.bookingStatusData.map((status) => ({
        name: status.name,
        value: status.value,
        fill: statusColors[status.name] || "#8884d8",
      }));

      setStats(statsArray);
      setBookingStatusData(bookingStatusFormatted);
      setPalaceData(data.palacePerformance);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <div className="p-8 max-w-7xl mx-auto bg-gray-100 flex-1">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 animate-pulse bg-gray-200 h-8 w-1/3 rounded"></h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[...Array(4)].map((_, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow p-6 animate-pulse h-28"
            ></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6 animate-pulse h-96"></div>
          <div className="bg-white rounded-lg shadow p-6 animate-pulse h-96"></div>
        </div>
      </div>
    );

  return (
    <section className="w-full max-h-screen bg-white p-4 md:p-8 overflow-y-auto ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's your party palace overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div key={idx} className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">
                      {stat.label}
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-2">
                      {stat.value}
                    </p>
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
          {/* Palace Performance */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Palace Performance
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={palaceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend />
                <Bar
                  yAxisId="left"
                  dataKey="bookings"
                  fill="#3b82f6"
                  name="Bookings"
                />
                <Bar
                  yAxisId="right"
                  dataKey="revenue"
                  fill="#10b981"
                  name="Revenue (Rs)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Booking Status */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Booking Status
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={bookingStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} (${value})`}
                  outerRadius={80}
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
      </div>
    </section>
  );
};

export default Dashboard;
