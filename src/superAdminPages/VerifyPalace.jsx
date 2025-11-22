import React, { useEffect, useState } from "react";
import api from "../utils/apiInstance";

const VerifyPalace = () => {
  const [palaces, setPalaces] = useState([]);
  const [filteredPalaces, setFilteredPalaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPalace, setSelectedPalace] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [verificationFilter, setVerificationFilter] = useState("all");
  const [confirmModal, setConfirmModal] = useState({
    open: false,
    type: "", // 'verify' or 'unverify'
    palace: null,
  });

  const token = localStorage.getItem("token");

  // Fetch all palaces
  const fetchPalaces = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/superadmin/partypalaces", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const palacesData = res.data.data || [];
      setPalaces(palacesData);
      setFilteredPalaces(palacesData);
    } catch (error) {
      console.log("Error fetching palaces:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and search palaces
  useEffect(() => {
    let results = palaces;

    // Apply search filter
    if (searchTerm) {
      results = results.filter((palace) =>
        palace.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply verification filter
    if (verificationFilter === "verified") {
      results = results.filter((palace) => palace.verified);
    } else if (verificationFilter === "unverified") {
      results = results.filter((palace) => !palace.verified);
    }

    setFilteredPalaces(results);
  }, [searchTerm, verificationFilter, palaces]);

  // Open modal with details
  const openDetailsModal = (item) => {
    setSelectedPalace(item);
    setOpenModal(true);
  };

  // Close modal
  const closeModal = () => {
    setOpenModal(false);
    setSelectedPalace(null);
  };

  // Open confirmation modal for verify/unverify
  const openConfirmationModal = (palace, type) => {
    setConfirmModal({
      open: true,
      type,
      palace,
    });
  };

  // Close confirmation modal
  const closeConfirmationModal = () => {
    setConfirmModal({
      open: false,
      type: "",
      palace: null,
    });
  };

  // Toggle verify (true/false)
  const toggleVerification = async (id, currentState) => {
    try {
      setUpdatingId(id);
      await api.put(
        "/api/superadmin/partypalace/verify",
        { id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setPalaces((prev) =>
        prev.map((p) => (p._id === id ? { ...p, verified: !currentState } : p))
      );

      closeConfirmationModal();
    } catch (error) {
      alert("Verification update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  // Delete a palace
  const deletePalace = async (id) => {
    if (!window.confirm("Are you sure you want to delete this palace?")) return;

    try {
      await api.delete(`/api/superadmin/partypalace/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPalaces((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.log(error);
      alert("Failed to delete palace");
    }
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm("");
    setVerificationFilter("all");
  };

  useEffect(() => {
    fetchPalaces();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen flex-1 bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 h-screen text-gray-900 flex-1 overflow-y-scroll">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Palaces Verification & Management
          </h1>
          <p className="text-gray-600">
            Manage verification status and details of all party palaces
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end justify-between">
            <div className="flex-1 w-full">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Search Palaces
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search by palace name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            <div className="w-full lg:w-64">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Verification Status
              </label>
              <select
                value={verificationFilter}
                onChange={(e) => setVerificationFilter(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              >
                <option value="all">All Palaces</option>
                <option value="verified">Verified Only</option>
                <option value="unverified">Unverified Only</option>
              </select>
            </div>

            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Clear Filters
            </button>
          </div>

          {/* Results Count */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Showing {filteredPalaces.length} of {palaces.length} palaces
            </p>
            {filteredPalaces.length === 0 && palaces.length > 0 && (
              <p className="text-sm text-orange-600">
                No palaces match your search criteria
              </p>
            )}
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Palace
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price/Hr
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Capacity
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPalaces.map((item) => (
                  <tr
                    key={item._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-12 w-16">
                          <img
                            src={item.images?.[0] || "/placeholder-image.jpg"}
                            alt={item.name}
                            className="h-12 w-16 rounded-lg object-cover shadow-sm"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {item.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        Rs. {item.pricePerHour}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.capacity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          item.verified
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {item.verified ? "Verified" : "Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => openDetailsModal(item)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="View Details"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        </button>

                        <button
                          onClick={() =>
                            openConfirmationModal(
                              item,
                              item.verified ? "unverify" : "verify"
                            )
                          }
                          disabled={updatingId === item._id}
                          className={`${
                            item.verified
                              ? "text-orange-600 hover:text-orange-900"
                              : "text-green-600 hover:text-green-900"
                          } transition-colors disabled:opacity-50`}
                          title={item.verified ? "Unverify" : "Verify"}
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            {item.verified ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            ) : (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            )}
                          </svg>
                        </button>

                        <button
                          onClick={() => deletePalace(item._id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Delete Palace"
                        >
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Empty State */}
          {filteredPalaces.length === 0 && !loading && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No palaces found
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                {palaces.length === 0
                  ? "Get started by adding some party palaces."
                  : "Try adjusting your search or filter criteria."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Details Modal */}
      {openModal && selectedPalace && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">
                  Palace Details
                </h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <img
                src={selectedPalace.images?.[0] || "/placeholder-image.jpg"}
                alt={selectedPalace.name}
                className="w-full h-48 object-cover rounded-lg mb-4 shadow-sm"
              />

              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Name
                  </label>
                  <p className="text-gray-900">{selectedPalace.name}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Location
                  </label>
                  <p className="text-gray-900">{selectedPalace.location}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Price per Hour
                    </label>
                    <p className="text-gray-900">
                      Rs. {selectedPalace.pricePerHour}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-500">
                      Capacity
                    </label>
                    <p className="text-gray-900">{selectedPalace.capacity}</p>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Owner Information
                  </h4>
                  <div className="space-y-2">
                    <p>
                      <span className="text-gray-600">Username:</span>{" "}
                      {selectedPalace?.createdBy?.username}
                    </p>
                    <p>
                      <span className="text-gray-600">Email:</span>{" "}
                      {selectedPalace?.createdBy?.email}
                    </p>
                    <p>
                      <span className="text-gray-600">Phone:</span>{" "}
                      {selectedPalace?.createdBy?.phone || "N/A"}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-500">
                    Description
                  </label>
                  <p className="text-gray-900 mt-1 text-sm leading-relaxed">
                    {selectedPalace.description || "No description provided."}
                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors font-medium"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal for Verify/Unverify */}
      {confirmModal.open && confirmModal.palace && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100">
                {confirmModal.type === "verify" ? (
                  <svg
                    className="w-6 h-6 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ) : (
                  <svg
                    className="w-6 h-6 text-orange-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                )}
              </div>

              <h2 className="text-xl font-bold text-gray-900 text-center mb-2">
                {confirmModal.type === "verify"
                  ? "Verify Party Palace"
                  : "Unverify Party Palace"}
              </h2>

              <p className="text-gray-600 text-center mb-6">
                {confirmModal.type === "verify"
                  ? `Are you sure you want to verify "${confirmModal.palace.name}"? This will mark the party palace as verified and visible to all users.`
                  : `Are you sure you want to unverify "${confirmModal.palace.name}"? This will mark the party palace as unverified and hide it from users.`}
              </p>

              <div className="flex gap-3">
                <button
                  onClick={closeConfirmationModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={() =>
                    toggleVerification(
                      confirmModal.palace._id,
                      confirmModal.palace.verified
                    )
                  }
                  disabled={updatingId === confirmModal.palace._id}
                  className={`flex-1 px-4 py-2 text-white rounded-lg transition-colors font-medium ${
                    confirmModal.type === "verify"
                      ? "bg-green-600 hover:bg-green-700 disabled:bg-green-400"
                      : "bg-orange-600 hover:bg-orange-700 disabled:bg-orange-400"
                  }`}
                >
                  {updatingId === confirmModal.palace._id ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : confirmModal.type === "verify" ? (
                    "Verify"
                  ) : (
                    "Unverify"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyPalace;
