import React, { useState, useEffect } from "react";
import { FaLocationPin, FaEye, FaTrash, FaDownload } from "react-icons/fa6";

const Payments = () => {
  // Sample data - replace with your API call
  const [paymentsData, setPaymentsData] = useState([
    {
      _id: "1",
      user: {
        name: "John Doe",
        email: "john@example.com",
      },
      partyPalace: {
        name: "Royal Palace",
        location: "Kathmandu",
        images: [
          "https://images.unsplash.com/photo-1519167758481-83f29da8c3a7?w=400",
        ],
      },
      bookingDate: "2025-12-15",
      guestCount: 150,
      totalPrice: 50000,
      advancePaid: 25000,
      status: "pending",
      createdAt: "2025-11-20",
    },
    {
      _id: "2",
      user: {
        name: "Jane Smith",
        email: "jane@example.com",
      },
      partyPalace: {
        name: "Grand Hall",
        location: "Lalitpur",
        images: [
          "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400",
        ],
      },
      bookingDate: "2025-12-20",
      guestCount: 200,
      totalPrice: 75000,
      advancePaid: 75000,
      status: "confirmed",
      createdAt: "2025-11-18",
    },
    {
      _id: "3",
      user: {
        name: "Ram Sharma",
        email: "ram@example.com",
      },
      partyPalace: {
        name: "Diamond Palace",
        location: "Bhaktapur",
        images: [
          "https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=400",
        ],
      },
      bookingDate: "2025-12-25",
      guestCount: 100,
      totalPrice: 40000,
      advancePaid: 15000,
      status: "pending",
      createdAt: "2025-11-22",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Filter payments
  const filteredPayments = paymentsData.filter((payment) => {
    const matchesSearch =
      payment.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.partyPalace.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "paid" && payment.advancePaid === payment.totalPrice) ||
      (filterStatus === "partial" &&
        payment.advancePaid < payment.totalPrice &&
        payment.advancePaid > 0) ||
      (filterStatus === "pending" && payment.advancePaid === 0);

    return matchesSearch && matchesFilter;
  });

  // Calculate statistics
  const stats = {
    totalBookings: paymentsData.length,
    totalRevenue: paymentsData.reduce((sum, p) => sum + p.advancePaid, 0),
    pendingAmount: paymentsData.reduce(
      (sum, p) => sum + (p.totalPrice - p.advancePaid),
      0
    ),
    fullyPaid: paymentsData.filter((p) => p.advancePaid === p.totalPrice)
      .length,
  };

  const handleMarkAsPaid = (paymentId) => {
    setPaymentsData((prev) =>
      prev.map((payment) =>
        payment._id === paymentId
          ? { ...payment, advancePaid: payment.totalPrice, status: "confirmed" }
          : payment
      )
    );
  };

  const handleRemovePayment = (paymentId) => {
    if (
      window.confirm("Are you sure you want to remove this payment record?")
    ) {
      setPaymentsData((prev) =>
        prev.filter((payment) => payment._id !== paymentId)
      );
    }
  };

  const handleViewDetails = (payment) => {
    setSelectedPayment(payment);
    setIsDetailModalOpen(true);
  };

  const exportToCSV = () => {
    const headers = [
      "User Name",
      "Email",
      "Palace",
      "Booking Date",
      "Total Price",
      "Paid",
      "Balance",
      "Status",
    ];
    const rows = filteredPayments.map((p) => [
      p.user.name,
      p.user.email,
      p.partyPalace.name,
      new Date(p.bookingDate).toLocaleDateString(),
      p.totalPrice,
      p.advancePaid,
      p.totalPrice - p.advancePaid,
      p.advancePaid === p.totalPrice ? "Fully Paid" : "Partial",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `payments-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="h-screen overflow-y-scroll bg-gray-50 p-6 ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Management
          </h1>
          <p className="text-gray-600">Track and manage all booking payments</p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl shadow-lg">
            <p className="text-blue-100 text-sm mb-1">Total Bookings</p>
            <p className="text-3xl font-bold text-white">
              {stats.totalBookings}
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-xl shadow-lg">
            <p className="text-green-100 text-sm mb-1">Total Revenue</p>
            <p className="text-3xl font-bold text-white">
              NPR {stats.totalRevenue.toLocaleString()}
            </p>
          </div>

          <div className="bg-gradient-to-br from-amber-600 to-amber-700 p-6 rounded-xl shadow-lg">
            <p className="text-amber-100 text-sm mb-1">Pending Amount</p>
            <p className="text-3xl font-bold text-white">
              NPR {stats.pendingAmount.toLocaleString()}
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-700 p-6 rounded-xl shadow-lg">
            <p className="text-purple-100 text-sm mb-1">Fully Paid</p>
            <p className="text-3xl font-bold text-white">{stats.fullyPaid}</p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🔍
              </span>
              <input
                type="text"
                placeholder="Search by user name, email, or palace..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Payments</option>
                <option value="paid">Fully Paid</option>
                <option value="partial">Partial Payment</option>
                <option value="pending">No Payment</option>
              </select>

              <button
                onClick={exportToCSV}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg flex items-center gap-2 transition-colors"
              >
                <FaDownload /> Export
              </button>
            </div>
          </div>
        </div>

        {/* Payments List */}
        <div className="space-y-4">
          {filteredPayments.length === 0 ? (
            <div className="bg-white p-8 rounded-xl text-center border border-gray-200">
              <p className="text-gray-500 text-lg">No payments found</p>
            </div>
          ) : (
            filteredPayments.map((payment) => (
              <div
                key={payment._id}
                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-gray-300"
              >
                <div className="flex flex-col lg:flex-row gap-6">
                  {/* Image */}
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={payment.partyPalace.images[0]}
                      alt={payment.partyPalace.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 space-y-4">
                    {/* User & Palace Info */}
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {payment.user.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {payment.user.email}
                        </p>
                        <div className="flex items-center gap-2 mt-2 text-gray-700">
                          <FaLocationPin className="text-blue-600" />
                          <span className="text-sm font-medium">
                            {payment.partyPalace.name}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm">
                            {payment.partyPalace.location}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Booking Date</p>
                          <p className="text-sm font-medium text-gray-900">
                            {new Date(payment.bookingDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-500">Guests</p>
                          <p className="text-sm font-medium text-gray-900">
                            {payment.guestCount}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Payment Progress */}
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-700">
                          Payment Progress
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          NPR {payment.advancePaid.toLocaleString()} / NPR{" "}
                          {payment.totalPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-300 ${
                            payment.advancePaid === payment.totalPrice
                              ? "bg-green-500"
                              : "bg-amber-500"
                          }`}
                          style={{
                            width: `${Math.min(
                              100,
                              (payment.advancePaid / payment.totalPrice) * 100
                            )}%`,
                          }}
                        ></div>
                      </div>
                      <div className="flex justify-between text-xs text-gray-600 mt-2">
                        <span>
                          Paid: NPR {payment.advancePaid.toLocaleString()}
                        </span>
                        <span className="font-semibold text-amber-600">
                          Balance: NPR{" "}
                          {(
                            payment.totalPrice - payment.advancePaid
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleViewDetails(payment)}
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                      >
                        <FaEye /> View Details
                      </button>

                      {payment.advancePaid < payment.totalPrice && (
                        <button
                          onClick={() => handleMarkAsPaid(payment._id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                        >
                          ✓ Mark as Fully Paid
                        </button>
                      )}

                      <button
                        onClick={() => handleRemovePayment(payment._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
                      >
                        <FaTrash /> Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedPayment && (
        <div
          onClick={() => setIsDetailModalOpen(false)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Payment Details
              </h2>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-gray-400 hover:text-gray-900 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              {/* User Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Customer Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Name:</span>
                    <span className="text-gray-900 font-medium">
                      {selectedPayment.user.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="text-gray-900">
                      {selectedPayment.user.email}
                    </span>
                  </div>
                </div>
              </div>

              {/* Booking Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Booking Information
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Palace:</span>
                    <span className="text-gray-900 font-medium">
                      {selectedPayment.partyPalace.name}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="text-gray-900">
                      {selectedPayment.partyPalace.location}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking Date:</span>
                    <span className="text-gray-900">
                      {new Date(
                        selectedPayment.bookingDate
                      ).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Guest Count:</span>
                    <span className="text-gray-900">
                      {selectedPayment.guestCount}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        selectedPayment.status === "confirmed"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {selectedPayment.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Payment Info */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Payment Breakdown
                </h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 border border-gray-200">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Price:</span>
                    <span className="text-gray-900 font-medium">
                      NPR {selectedPayment.totalPrice.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="text-green-600 font-medium">
                      NPR {selectedPayment.advancePaid.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-300">
                    <span className="text-gray-700 font-medium">
                      Balance Due:
                    </span>
                    <span className="text-amber-600 font-bold text-lg">
                      NPR{" "}
                      {(
                        selectedPayment.totalPrice - selectedPayment.advancePaid
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payments;
