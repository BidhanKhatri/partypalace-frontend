import React, { useState, useEffect } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Calendar,
  Star,
  Camera,
  Clock,
  MapPinOff,
  Search,
  Loader,
} from "lucide-react";
import LoadingState from "../components/LoadingState";
import { IoMdCloseCircle } from "react-icons/io";

const CameramanCard = () => {
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedCard, setSelectedCard] = useState(null);
  const [coordinates, setCoordinates] = useState({
    lat: 27.7,
    lng: 85.3,
  });

  const [visibility, setVisibility] = useState("");

  //   console.log("response data", responseData);

  // API base URL - you can modify this to match your backend
  const API_BASE_URL = "/proxy/api/cameraman";

  // Function to fetch cameramen based on coordinates
  const fetchCameramen = async (lat, lng) => {
    if (!lat || !lng || isNaN(lat) || isNaN(lng)) {
      setError("Invalid coordinates");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/find-nearest-cameraman?lat=${lat}&lng=${lng}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch cameramen");
      }

      const data = await response.json();
      setResponseData(data);
    } catch (err) {
      setError(err.message || "Something went wrong");
      console.error("Error fetching cameramen:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (
      coordinates.lat !== undefined &&
      coordinates.lng !== undefined &&
      !isNaN(coordinates.lat) &&
      !isNaN(coordinates.lng)
    ) {
      fetchCameramen(coordinates.lat, coordinates.lng);
    }
  }, [coordinates.lat, coordinates.lng]); // depend on coordinates

  // Handle coordinate change and search
  const handleSearch = () => {
    if (coordinates.lat && coordinates.lng) {
      fetchCameramen(coordinates.lat, coordinates.lng);
    } else {
      setError("Please enter valid coordinates");
    }
  };

  // Handle input changes
  const handleCoordinateChange = (field, value) => {
    setCoordinates((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Get user's current location
  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newCoords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCoordinates(newCoords); // updates state
          fetchCameramen(newCoords.lat, newCoords.lng); // fetches with correct coords
        },
        (error) => {
          setError("Unable to get your location");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser");
      setLoading(false);
    }
  };

  const handleCardClick = (cameraman) => {
    setSelectedCard(selectedCard === cameraman._id ? null : cameraman._id);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getLocationString = (coordinates) => {
    return `${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}`;
  };

  // Empty state component
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center p-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 b">
      <div className="bg-gray-100 rounded-full p-6 mb-4">
        <MapPinOff className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-700 mb-2">
        No Cameraman Found Nearby
      </h3>
      <p className="text-gray-500 text-center mb-4 max-w-md">
        We couldn't find any available cameramen in your current location. Try
        searching in another area or expand your search radius.
      </p>
      <div className="flex space-x-3">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Try Another Location
        </button>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          Expand Search
        </button>
      </div>
    </div>
  );

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Search for Cameramen
          </h2>
        </div>
        <LoadingState />
      </div>
    );
  }

  // Show error state
  //   if (error) {
  //     return (
  //       <div className="max-w-4xl mx-auto p-6">
  //         <div className="mb-6">
  //           <h2 className="text-2xl font-bold text-gray-800 mb-2">
  //             Search for Cameramen
  //           </h2>
  //         </div>
  //         <ErrorState
  //           error={error}
  //           onRetry={() => fetchCameramen(coordinates.lat, coordinates.lng)}
  //         />
  //       </div>
  //     );
  //   }

  // Check if data is empty or null
  if (
    !responseData ||
    !responseData.success ||
    !responseData.data ||
    responseData.data.length === 0
  ) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Search for Cameramen
          </h2>
          {/* Search Controls */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-4">
            <div className="flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-32">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={coordinates.lat}
                  onChange={(e) =>
                    handleCoordinateChange("lat", parseFloat(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="27.632418"
                />
              </div>
              <div className="flex-1 min-w-32">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude
                </label>
                <input
                  type="number"
                  step="any"
                  value={coordinates.lng}
                  onChange={(e) =>
                    handleCoordinateChange("lng", parseFloat(e.target.value))
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="85.362488"
                />
              </div>
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
              >
                <Search className="w-4 h-4 mr-2" />
                Search
              </button>
              <button
                onClick={getCurrentLocation}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
              >
                <MapPin className="w-4 h-4 mr-2" />
                Use My Location
              </button>
            </div>
          </div>
        </div>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6">
       

        {/* Search Controls */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4 mt-10">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-32">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                value={coordinates.lat}
                onChange={(e) =>
                  handleCoordinateChange("lat", parseFloat(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="27.632418"
              />
            </div>
            <div className="flex-1 min-w-32">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                value={coordinates.lng}
                onChange={(e) =>
                  handleCoordinateChange("lng", parseFloat(e.target.value))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="85.362488"
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center disabled:opacity-50"
            >
              {loading ? (
                <Loader className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Search className="w-4 h-4 mr-2" />
              )}
              Search
            </button>
            <button
              onClick={getCurrentLocation}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
            >
              <MapPin className="w-4 h-4 mr-2" />
              Use My Location
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {responseData.data.map((cameraman) => (
          <div
            key={cameraman._id}
            className={`bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border-2 ${
              selectedCard === cameraman._id
                ? "border-blue-500 scale-105"
                : "border-transparent"
            }`}
            onClick={() => handleCardClick(cameraman)}
          >
            {/* Profile Image */}
            <div className="relative bg-neutral-100 ">
              <img
                src={cameraman.profileImage}
                alt={cameraman.name}
                className="w-full h-48 object-scale-down rounded-t-xl "
              />
              <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-sm flex items-center">
                <Camera className="w-4 h-4 mr-1" />
                {cameraman.role}
              </div>
            </div>

            {/* Card Content */}
            <div className="p-6">
              {/* Name and Experience */}
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xl font-semibold text-gray-800 capitalize">
                  {cameraman.name}
                </h3>
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="ml-1 text-sm text-gray-600">New</span>
                </div>
              </div>

              {/* Experience */}
              <div className="flex items-center mb-3 text-gray-600">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  {cameraman.experienceYears} years experience
                </span>
              </div>

              {/* Contact Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  <span className="text-sm">{cameraman.mobile}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2" />
                  <span className="text-sm">{cameraman.email}</span>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-center mb-4 text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  {getLocationString(cameraman.baseLocation.coordinates)}
                </span>
              </div>

              {/* Expanded Details */}
              {selectedCard === cameraman._id && (
                <div className="mt-4 pt-4 border-t border-gray-200 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Member since:</span>
                    <span className="font-medium">
                      {formatDate(cameraman.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Last updated:</span>
                    <span className="font-medium">
                      {formatDate(cameraman.updatedAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Availability:</span>
                    <span className="font-medium text-green-600">
                      {cameraman.unavailableDates.length === 0
                        ? "Available"
                        : "Limited"}
                    </span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2 mt-4">
                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Book Now
                </button>
                <button className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                  View Profile
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CameramanCard;
