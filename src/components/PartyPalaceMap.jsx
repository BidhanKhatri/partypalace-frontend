import React, { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import {
  MapPin,
  Phone,
  Mail,
  Award,
  Navigation,
  Zap,
  Route,
  X,
} from "lucide-react";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import api from "../utils/apiInstance";
import { toast } from "react-toastify";

// Fix leaflet default icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Custom marker icon for party palace
const createPartyPalaceIcon = (isSelected = false) => {
  return L.divIcon({
    html: `
      <div style="
        background: ${isSelected ? "#EC4899" : "#8B5CF6"};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        transition: all 0.3s ease;
      ">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
          <path d="M3 21h18M3 10h18M5 5h14M9 9v12M15 9v12"/>
        </svg>
      </div>
    `,
    className: "custom-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

// Custom marker icon for user location
const createUserLocationIcon = () => {
  return L.divIcon({
    html: `
      <div class="flex items-center justify-center w-9 h-9 bg-white rounded-full shadow-md">
        <img src="/location-map.svg" alt="User location" class="w-6 h-6" />
      </div>
    `,
    className: "user-location-marker",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

const PartyPalaceMap = () => {
  const [selectedPartyPalace, setSelectedPartyPalace] = useState(null);
  const [partyPalaceData, setPartyPalaceData] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [pathMode, setPathMode] = useState(false);
  const [pathCoordinates, setPathCoordinates] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterCapacity, setFilterCapacity] = useState("");
  const [filterRating, setFilterRating] = useState("");
  const [nearestPalace, setNearestPalace] = useState(null);
  const [loading, setLoading] = useState(true);
  const mapRef = useRef(null);

  // Request user location on component mount
  useEffect(() => {
    requestUserLocation();
    getAllPartyPalaces();
  }, []);

  // Apply filters
  useEffect(() => {
    applyFilters();
  }, [partyPalaceData, filterCapacity, filterRating]);

  const requestUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setLocationError(null);
          toast.success("Location access granted!");
        },
        (error) => {
          setLocationError(error.message);
          toast.error("Unable to access location: " + error.message);
          // Set default location if geolocation fails
          setUserLocation({ lat: 27.632418, lng: 85.362488 });
        }
      );
    } else {
      setLocationError("Geolocation is not supported");
      toast.error("Geolocation is not supported");
      setUserLocation({ lat: 27.632418, lng: 85.362488 });
    }
  };

  const getAllPartyPalaces = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/partypalace/get-all");
      if (res && res.data.success) {
        setPartyPalaceData(res.data.data || []);
        setFilteredData(res.data.data || []);
      } else {
        toast.error(res.data.msg || "Error fetching data");
      }
    } catch (error) {
      console.log(error);
      toast.error("Error fetching party palaces");
      setPartyPalaceData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...partyPalaceData];

    if (filterCapacity) {
      filtered = filtered.filter(
        (palace) =>
          palace.capacity && palace.capacity >= parseInt(filterCapacity)
      );
    }

    if (filterRating) {
      filtered = filtered.filter(
        (palace) => palace.rating && palace.rating >= parseFloat(filterRating)
      );
    }

    setFilteredData(filtered);
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const zoomToNearest = () => {
    if (!userLocation || filteredData.length === 0) {
      toast.error("User location or palaces not available");
      return;
    }

    let nearest = null;
    let minDistance = Infinity;

    filteredData.forEach((palace) => {
      if (palace.location && palace.location.coordinates) {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          palace.location.coordinates[0],
          palace.location.coordinates[1]
        );

        if (distance < minDistance) {
          minDistance = distance;
          nearest = palace;
        }
      }
    });

    if (nearest && mapRef.current) {
      setNearestPalace(nearest);
      setSelectedPartyPalace(nearest._id);
      mapRef.current.setView(
        [nearest.location.coordinates[0], nearest.location.coordinates[1]],
        18
      );
      toast.success(`Nearest palace: ${nearest.name}`);
    } else {
      toast.error("No palaces found");
    }
  };

  const togglePathMode = () => {
    if (pathMode) {
      setPathCoordinates([]);
    }
    setPathMode(!pathMode);
  };

  const handleMapClick = (e) => {
    if (pathMode && e.latlng) {
      const { lat, lng } = e.latlng;
      setPathCoordinates((prev) => [...prev, [lat, lng]]);
    }
  };

  const clearPath = () => {
    setPathCoordinates([]);
    setPathMode(false);
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="w-full h-screen flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">
              Loading party palaces...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="w-full h-screen overflow-hidden bg-gray-100 relative">
        {/* Header */}
        <div className="fixed top-20 left-4 right-4 sm:right-auto sm:max-w-md z-[1000] bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-purple-100 rounded-lg shrink-0">
              <MapPin className="w-6 h-6 text-purple-600" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-gray-800 truncate">
                Party Palaces
              </h1>
              <p className="text-sm text-gray-600">
                {filteredData.length} locations available
              </p>
            </div>
          </div>

          {/* Filter Section */}
          <div className="space-y-3 border-t pt-3">
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Min Capacity
              </label>
              <input
                type="number"
                value={filterCapacity}
                onChange={(e) => setFilterCapacity(e.target.value)}
                placeholder="Enter capacity"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">
                Min Rating
              </label>
              <input
                type="number"
                step="0.1"
                max="5"
                value={filterRating}
                onChange={(e) => setFilterRating(e.target.value)}
                placeholder="0 - 5"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={() => {
                setFilterCapacity("");
                setFilterRating("");
              }}
              className="w-full text-sm px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Map Controls */}
        <div className="fixed top-20 right-4 z-[1000] space-y-2">
          <Link
            to="/"
            className="bg-black p-2 text-white rounded-md flex flex-row items-center gap-2 cursor-pointer hover:scale-105 transition-all w-full justify-center text-sm"
          >
            ← Back
          </Link>
          <button
            onClick={zoomToNearest}
            className="bg-blue-600 p-2 text-white rounded-md flex flex-row items-center gap-2 cursor-pointer hover:bg-blue-700 transition-all w-full justify-center text-sm"
            title="Find nearest party palace"
          >
            <Zap size={16} />
            Nearest
          </button>
          <button
            onClick={togglePathMode}
            className={`p-2 text-white rounded-md flex flex-row items-center gap-2 cursor-pointer transition-all w-full justify-center text-sm ${
              pathMode
                ? "bg-green-600 hover:bg-green-700"
                : "bg-orange-600 hover:bg-orange-700"
            }`}
            title="Create path between locations"
          >
            <Route size={16} />
            {pathMode ? "Stop Path" : "Path"}
          </button>
          {pathCoordinates.length > 0 && (
            <button
              onClick={clearPath}
              className="bg-red-600 p-2 text-white rounded-md flex flex-row items-center gap-2 cursor-pointer hover:bg-red-700 transition-all w-full justify-center text-sm"
            >
              <X size={16} />
              Clear
            </button>
          )}
        </div>

        {/* Map Container */}
        <div className="w-full h-full">
          {userLocation ? (
            <MapContainer
              ref={mapRef}
              center={[userLocation.lat, userLocation.lng]}
              zoom={14}
              style={{ height: "100%", width: "100%" }}
              className="z-0"
              onClick={handleMapClick}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* User Location Marker */}
              {userLocation && (
                <Marker
                  position={[userLocation.lat, userLocation.lng]}
                  icon={createUserLocationIcon()}
                >
                  <Popup>
                    <div className="p-2">
                      <h3 className="font-semibold text-blue-600 text-sm">
                        Your Location
                      </h3>
                      <p className="text-xs text-gray-600 mt-1">
                        {userLocation.lat.toFixed(4)},{" "}
                        {userLocation.lng.toFixed(4)}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Party Palace Markers */}
              {filteredData.map((palace) => {
                if (!palace.location || !palace.location.coordinates)
                  return null;
                return (
                  <Marker
                    key={palace._id}
                    position={[
                      palace.location.coordinates[0],
                      palace.location.coordinates[1],
                    ]}
                    icon={createPartyPalaceIcon(
                      selectedPartyPalace === palace._id
                    )}
                    eventHandlers={{
                      click: () => setSelectedPartyPalace(palace._id),
                    }}
                  >
                    <Popup minWidth={300} maxWidth={350}>
                      <div className="p-3">
                        {/* Header */}
                        <div className="flex items-center space-x-3 mb-3">
                          {palace.image && (
                            <img
                              src={palace.image}
                              alt={palace.name}
                              className="w-12 h-12 rounded-lg object-cover border-2 border-gray-200 shrink-0"
                              onError={(e) => {
                                e.target.src = "https://via.placeholder.com/50";
                              }}
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-gray-800 text-sm truncate">
                              {palace.name}
                            </h3>
                            {palace.type && (
                              <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium mt-1">
                                {palace.type}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-2 mb-3">
                          {palace.capacity && (
                            <div className="flex items-center space-x-2">
                              <span className="text-xs font-medium text-gray-600">
                                Capacity:
                              </span>
                              <span className="text-xs text-gray-700">
                                {palace.capacity} guests
                              </span>
                            </div>
                          )}
                          {palace.rating && (
                            <div className="flex items-center space-x-2">
                              <Award className="w-3 h-3 text-yellow-500 shrink-0" />
                              <span className="text-xs text-gray-700">
                                {palace.rating.toFixed(1)}/5 rating
                              </span>
                            </div>
                          )}
                          {userLocation && palace.location.coordinates && (
                            <div className="flex items-center space-x-2">
                              <Navigation className="w-3 h-3 text-blue-500 shrink-0" />
                              <span className="text-xs text-gray-700">
                                {calculateDistance(
                                  userLocation.lat,
                                  userLocation.lng,
                                  palace.location.coordinates[0],
                                  palace.location.coordinates[1]
                                ).toFixed(2)}{" "}
                                km away
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Contact */}
                        {(palace.phone || palace.email) && (
                          <div className="space-y-2 mb-3">
                            {palace.phone && (
                              <div className="flex items-center space-x-2">
                                <Phone className="w-3 h-3 text-gray-500 shrink-0" />
                                <span className="text-xs text-gray-700 truncate">
                                  {palace.phone}
                                </span>
                              </div>
                            )}
                            {palace.email && (
                              <div className="flex items-center space-x-2">
                                <Mail className="w-3 h-3 text-gray-500 shrink-0" />
                                <span className="text-xs text-gray-700 truncate">
                                  {palace.email}
                                </span>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex space-x-2">
                          <button className="flex-1 bg-purple-600 text-white py-2 px-3 rounded-md text-xs font-medium hover:bg-purple-700 transition-colors">
                            Book
                          </button>
                          <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-md text-xs font-medium hover:bg-gray-200 transition-colors">
                            Details
                          </button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* Path Line */}
              {pathCoordinates.length > 1 && (
                <Polyline
                  positions={pathCoordinates}
                  color="#FF6B6B"
                  weight={3}
                  opacity={0.7}
                  dashArray="5, 5"
                />
              )}
            </MapContainer>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <p className="text-gray-600 font-medium">Loading map...</p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="fixed bottom-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-3 max-w-xs text-sm">
          <h3 className="font-semibold text-gray-800 mb-2">Legend</h3>
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full border border-white shrink-0"></div>
              <span className="text-xs text-gray-700">Your Location</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full border border-white shrink-0"></div>
              <span className="text-xs text-gray-700">Party Palace</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-pink-500 rounded-full border border-white shrink-0"></div>
              <span className="text-xs text-gray-700">Selected</span>
            </div>
          </div>
        </div>

        {/* Path Instructions */}
        {pathMode && (
          <div className="fixed bottom-4 right-4 z-[1000] bg-orange-100 border-2 border-orange-500 rounded-lg p-2 max-w-xs text-xs">
            <p className="text-orange-800 font-medium">
              Click map to add points ({pathCoordinates.length})
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default PartyPalaceMap;
