import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import {
  MapPin,
  Navigation,
  Zap,
  X,
  DollarSign,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import api from "../utils/apiInstance";
import { Link } from "react-router-dom";

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

// Custom marker icon for user location with pulsing animation
const createUserLocationIcon = () => {
  return L.divIcon({
    html: `
      <div style="
        position: relative;
        width: 38px;
        height: 38px;
      ">
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 38px;
          height: 38px;
          border-radius: 50%;
          border: 3px solid #3B82F6;
          animation: pulse-ring 2s infinite;
        "></div>
        <div style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background: white;
          width: 38px;
          height: 38px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          border: 3px solid #3B82F6;
        ">
          <img 
            src="/location-map.svg" 
            alt="User Location"
            style="width: 24px; height: 24px; border-radius: 50%;" 
          />
        </div>
      </div>
      <style>
        @keyframes pulse-ring {
          0% {
            width: 38px;
            height: 38px;
            opacity: 1;
          }
          100% {
            width: 70px;
            height: 70px;
            opacity: 0;
          }
        }
      </style>
    `,
    className: "user-location-marker",
    iconSize: [70, 70],
    iconAnchor: [35, 35],
    popupAnchor: [0, -35],
  });
};

// Route renderer component
const RouteRenderer = ({ pathCoordinates }) => {
  const map = useMap();

  useEffect(() => {
    if (pathCoordinates && pathCoordinates.length > 0) {
      const routeGroup = L.featureGroup();

      pathCoordinates.forEach((segment) => {
        if (segment && segment.length > 0) {
          const polyline = L.polyline(segment, {
            color: "#3B82F6",
            weight: 4,
            opacity: 0.8,
            smoothFactor: 1.0,
            className: "route-line",
          }).addTo(routeGroup);
        }
      });

      routeGroup.addTo(map);

      if (routeGroup.getLayers().length > 0) {
        setTimeout(() => {
          map.fitBounds(routeGroup.getBounds(), {
            padding: [50, 50],
            maxZoom: 18,
            animate: true,
            duration: 1.2,
          });
        }, 100);
      }

      return () => {
        map.removeLayer(routeGroup);
      };
    }
  }, [pathCoordinates, map]);

  return null;
};

// Animated User Location Marker Component
const AnimatedUserMarker = ({ position }) => {
  const markerRef = useRef(null);

  useEffect(() => {
    if (markerRef.current && position) {
      markerRef.current.setLatLng([position.lat, position.lng]);
    }
  }, [position]);

  return (
    <Marker
      ref={markerRef}
      position={[position.lat, position.lng]}
      icon={createUserLocationIcon()}
    >
      <Popup>
        <div className="p-2">
          <h3 className="font-semibold text-blue-600 text-sm">Your Location</h3>
          <p className="text-xs text-gray-600 mt-1">
            {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
          </p>
        </div>
      </Popup>
    </Marker>
  );
};

const PartyPalaceMap = () => {
  const [selectedPartyPalace, setSelectedPartyPalace] = useState(null);
  const [partyPalaceData, setPartyPalaceData] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [pathCoordinates, setPathCoordinates] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filterCapacity, setFilterCapacity] = useState("");
  const [filterRating, setFilterRating] = useState("");
  const [nearestPalace, setNearestPalace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const [searchType, setSearchType] = useState(null);
  const [showSearchMenu, setShowSearchMenu] = useState(false);
  const mapRef = useRef(null);
  const watchIdRef = useRef(null);

  useEffect(() => {
    requestUserLocation();
    getAllPartyPalaces();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [partyPalaceData, filterCapacity, filterRating]);

  useEffect(() => {
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  const requestUserLocation = () => {
    if ("geolocation" in navigator) {
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          setLocationError(null);
          console.log("Location updated!");
        },
        (error) => {
          setLocationError(error.message);
          console.error("Unable to access location: " + error.message);
          setUserLocation({ lat: 27.632418, lng: 85.362488 });
        },
        { enableHighAccuracy: true }
      );
    } else {
      setLocationError("Geolocation is not supported");
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
      }
    } catch (error) {
      console.log(error);
      console.error("Error fetching party palaces");
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

  const fetchRoute = async (start, end) => {
    try {
      const url = `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?geometries=geojson&overview=full`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.routes && data.routes.length > 0) {
        const route = data.routes[0];
        const coordinates = route.geometry.coordinates.map((coord) => [
          coord[1],
          coord[0],
        ]);
        return [coordinates];
      }
    } catch (error) {
      console.error("Error fetching route:", error);
    }
    return null;
  };

  // Algorithm: Greedy approach - Find nearest palace
  const findNearest = () => {
    if (!userLocation || filteredData.length === 0) return null;

    let nearest = null;
    let minDistance = Infinity;

    filteredData.forEach((palace) => {
      if (
        palace.baseLocation &&
        palace.baseLocation.coordinates &&
        palace.baseLocation.coordinates.length === 2
      ) {
        const distance = calculateDistance(
          userLocation.lat,
          userLocation.lng,
          palace.baseLocation.coordinates[1],
          palace.baseLocation.coordinates[0]
        );

        if (distance < minDistance) {
          minDistance = distance;
          nearest = palace;
        }
      }
    });

    return nearest;
  };

  // Algorithm: Multi-criteria optimization - Nearest AND Cheapest
  // Uses weighted scoring: distance (normalized) + price (normalized)
  const findNearestAndCheapest = () => {
    if (!userLocation || filteredData.length === 0) return null;

    const validPalaces = filteredData.filter(
      (palace) =>
        palace.baseLocation &&
        palace.baseLocation.coordinates &&
        palace.baseLocation.coordinates.length === 2 &&
        palace.pricePerHour
    );

    if (validPalaces.length === 0) return null;

    // Calculate distances and find min/max for normalization
    const palacesWithMetrics = validPalaces.map((palace) => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        palace.baseLocation.coordinates[1],
        palace.baseLocation.coordinates[0]
      );
      return { palace, distance, price: palace.pricePerHour };
    });

    const maxDistance = Math.max(...palacesWithMetrics.map((p) => p.distance));
    const minDistance = Math.min(...palacesWithMetrics.map((p) => p.distance));
    const maxPrice = Math.max(...palacesWithMetrics.map((p) => p.price));
    const minPrice = Math.min(...palacesWithMetrics.map((p) => p.price));

    // Normalize and calculate composite score (lower is better)
    let bestPalace = null;
    let bestScore = Infinity;

    palacesWithMetrics.forEach(({ palace, distance, price }) => {
      const normalizedDistance =
        maxDistance !== minDistance
          ? (distance - minDistance) / (maxDistance - minDistance)
          : 0;
      const normalizedPrice =
        maxPrice !== minPrice ? (price - minPrice) / (maxPrice - minPrice) : 0;

      // Weight: 50% distance, 50% price
      const score = 0.5 * normalizedDistance + 0.5 * normalizedPrice;

      if (score < bestScore) {
        bestScore = score;
        bestPalace = palace;
      }
    });

    return bestPalace;
  };

  // Algorithm: Multi-criteria optimization - Nearest AND Most Expensive
  const findNearestAndExpensive = () => {
    if (!userLocation || filteredData.length === 0) return null;

    const validPalaces = filteredData.filter(
      (palace) =>
        palace.baseLocation &&
        palace.baseLocation.coordinates &&
        palace.baseLocation.coordinates.length === 2 &&
        palace.pricePerHour
    );

    if (validPalaces.length === 0) return null;

    const palacesWithMetrics = validPalaces.map((palace) => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        palace.baseLocation.coordinates[1],
        palace.baseLocation.coordinates[0]
      );
      return { palace, distance, price: palace.pricePerHour };
    });

    const maxDistance = Math.max(...palacesWithMetrics.map((p) => p.distance));
    const minDistance = Math.min(...palacesWithMetrics.map((p) => p.distance));
    const maxPrice = Math.max(...palacesWithMetrics.map((p) => p.price));
    const minPrice = Math.min(...palacesWithMetrics.map((p) => p.price));

    // Normalize and calculate composite score (maximize price, minimize distance)
    let bestPalace = null;
    let bestScore = -Infinity;

    palacesWithMetrics.forEach(({ palace, distance, price }) => {
      const normalizedDistance =
        maxDistance !== minDistance
          ? (distance - minDistance) / (maxDistance - minDistance)
          : 0;
      const normalizedPrice =
        maxPrice !== minPrice ? (price - minPrice) / (maxPrice - minPrice) : 0;

      // Weight: minimize distance, maximize price
      const score = -0.5 * normalizedDistance + 0.5 * normalizedPrice;

      if (score > bestScore) {
        bestScore = score;
        bestPalace = palace;
      }
    });

    return bestPalace;
  };

  // Algorithm: Max-Min approach - Farthest AND Cheapest
  const findFarthestAndCheapest = () => {
    if (!userLocation || filteredData.length === 0) return null;

    const validPalaces = filteredData.filter(
      (palace) =>
        palace.baseLocation &&
        palace.baseLocation.coordinates &&
        palace.baseLocation.coordinates.length === 2 &&
        palace.pricePerHour
    );

    if (validPalaces.length === 0) return null;

    const palacesWithMetrics = validPalaces.map((palace) => {
      const distance = calculateDistance(
        userLocation.lat,
        userLocation.lng,
        palace.baseLocation.coordinates[1],
        palace.baseLocation.coordinates[0]
      );
      return { palace, distance, price: palace.pricePerHour };
    });

    const maxDistance = Math.max(...palacesWithMetrics.map((p) => p.distance));
    const minDistance = Math.min(...palacesWithMetrics.map((p) => p.distance));
    const maxPrice = Math.max(...palacesWithMetrics.map((p) => p.price));
    const minPrice = Math.min(...palacesWithMetrics.map((p) => p.price));

    // Maximize distance, minimize price
    let bestPalace = null;
    let bestScore = -Infinity;

    palacesWithMetrics.forEach(({ palace, distance, price }) => {
      const normalizedDistance =
        maxDistance !== minDistance
          ? (distance - minDistance) / (maxDistance - minDistance)
          : 0;
      const normalizedPrice =
        maxPrice !== minPrice ? (price - minPrice) / (maxPrice - minPrice) : 0;

      // Weight: maximize distance, minimize price
      const score = 0.5 * normalizedDistance - 0.5 * normalizedPrice;

      if (score > bestScore) {
        bestScore = score;
        bestPalace = palace;
      }
    });

    return bestPalace;
  };

  const displayRoute = async (palace, type) => {
    if (!palace || !userLocation) return;

    setIsAnimating(true);
    setNearestPalace(palace);
    setSelectedPartyPalace(palace._id);
    setSearchType(type);

    const routeCoordinates = await fetchRoute(
      [userLocation.lat, userLocation.lng],
      [palace.baseLocation.coordinates[1], palace.baseLocation.coordinates[0]]
    );

    if (routeCoordinates) {
      setPathCoordinates(routeCoordinates);
    } else {
      const pathCoords = [
        [userLocation.lat, userLocation.lng],
        [
          palace.baseLocation.coordinates[1],
          palace.baseLocation.coordinates[0],
        ],
      ];
      setPathCoordinates([pathCoords]);
    }

    setTimeout(() => {
      setIsAnimating(false);
    }, 1500);
  };

  const handleSearchOption = async (option) => {
    let palace = null;

    switch (option) {
      case "nearest":
        palace = findNearest();
        if (palace) {
          await displayRoute(palace, "nearest");
        } else {
          console.error("No palaces found");
        }
        break;
      case "nearest-cheapest":
        palace = findNearestAndCheapest();
        if (palace) {
          await displayRoute(palace, "nearest-cheapest");
        } else {
          console.error("No palaces with price found");
        }
        break;
      case "nearest-expensive":
        palace = findNearestAndExpensive();
        if (palace) {
          await displayRoute(palace, "nearest-expensive");
        } else {
          console.error("No palaces with price found");
        }
        break;
      case "farthest-cheapest":
        palace = findFarthestAndCheapest();
        if (palace) {
          await displayRoute(palace, "farthest-cheapest");
        } else {
          console.error("No palaces with price found");
        }
        break;
      default:
        break;
    }

    setShowSearchMenu(false);
  };

  const clearPath = () => {
    setPathCoordinates([]);
    setNearestPalace(null);
    setSelectedPartyPalace(null);
    setSearchType(null);
  };

  const getSearchTypeLabel = () => {
    switch (searchType) {
      case "nearest":
        return "Nearest Palace";
      case "nearest-cheapest":
        return "Nearest & Cheapest";
      case "nearest-expensive":
        return "Nearest & Premium";
      case "farthest-cheapest":
        return "Farthest & Cheapest";
      default:
        return "";
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-200 font-medium">Loading party palaces...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-screen overflow-hidden bg-gray-100 relative">
      {/* Header - Mobile Responsive */}
      <div className="fixed top-14 lg:top-20 left-4 right-4 w-32 max-w-md md:w-56 sm:right-auto sm:max-w-md z-[1000] bg-white rounded-lg shadow-lg p-3 sm:p-4">
        <div className="flex items-center space-x-2 sm:space-x-3 mb-3">
          <div className="p-2 bg-purple-100 rounded-lg shrink-0">
            <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-purple-600" />
          </div>
          <div className="min-w-0">
            <h1 className="text-lg sm:text-xl font-bold text-gray-800 truncate hidden sm:block">
              Party Palaces
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              {filteredData.length} locations
            </p>
          </div>
        </div>

        {/* Filter Section */}
        <div className="space-y-2 sm:space-y-3 border-t pt-2 sm:pt-3">
          <div>
            <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">
              Min Capacity
            </label>
            <input
              type="number"
              value={filterCapacity}
              onChange={(e) => setFilterCapacity(e.target.value)}
              placeholder="capacity"
              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            onClick={() => {
              setFilterCapacity("");
              setFilterRating("");
            }}
            className="w-full text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Map Controls - Messenger-style Popup Menu */}
      <div className="fixed top-14 md:top-20 right-4 z-[1000]">
        {/* Options Menu - appears when showSearchMenu is true */}
        {showSearchMenu && (
          <div className="absolute top-12 right-0 bg-white lg:w-64 rounded-lg shadow-2xl overflow-hidden mb-2 animate-scale-in">
            <div className="py-2">
              <button
                onClick={() => handleSearchOption("nearest")}
                disabled={isAnimating}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-blue-50 transition-colors disabled:opacity-50 text-left"
              >
                <div className="p-2 bg-blue-100 rounded-full">
                  <Zap size={18} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">Nearest</p>
                  <p className="text-xs text-gray-500">Find closest palace</p>
                </div>
              </button>

              <button
                onClick={() => handleSearchOption("nearest-cheapest")}
                disabled={isAnimating}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-green-50 transition-colors disabled:opacity-50 text-left"
              >
                <div className="p-2 bg-green-100 rounded-full">
                  <TrendingDown size={18} className="text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">
                    Near + Cheap
                  </p>
                  <p className="text-xs text-gray-500">
                    Balanced budget option
                  </p>
                </div>
              </button>

              <button
                onClick={() => handleSearchOption("nearest-expensive")}
                disabled={isAnimating}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-purple-50 transition-colors disabled:opacity-50 text-left"
              >
                <div className="p-2 bg-purple-100 rounded-full">
                  <TrendingUp size={18} className="text-purple-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">
                    Near + Premium
                  </p>
                  <p className="text-xs text-gray-500">Luxury nearby</p>
                </div>
              </button>

              <button
                onClick={() => handleSearchOption("farthest-cheapest")}
                disabled={isAnimating}
                className="w-full px-4 py-3 flex items-center gap-3 hover:bg-orange-50 transition-colors disabled:opacity-50 text-left"
              >
                <div className="p-2 bg-orange-100 rounded-full">
                  <DollarSign size={18} className="text-orange-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm">
                    Far + Cheap
                  </p>
                  <p className="text-xs text-gray-500">Best savings</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Main Toggle Button */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowSearchMenu(!showSearchMenu)}
            className={`${
              showSearchMenu
                ? "bg-purple-600"
                : "bg-gradient-to-r from-purple-600 to-blue-600"
            } p-3 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95`}
            title="Search options"
          >
            {showSearchMenu ? <X size={24} /> : <Zap size={24} />}
          </button>

          {pathCoordinates.length > 0 && (
            <button
              onClick={clearPath}
              className="bg-red-600 p-3 text-white rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
              title="Clear route"
            >
              <X size={24} />
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          0% {
            opacity: 0;
            transform: scale(0.9) translateY(10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.2s ease-out forwards;
        }
      `}</style>

      {/* Map Container */}
      <div className="w-full h-full">
        {userLocation ? (
          <MapContainer
            ref={mapRef}
            center={[userLocation.lat, userLocation.lng]}
            zoom={14}
            style={{ height: "100%", width: "100%" }}
            className="z-0 mt-10"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {pathCoordinates.length > 0 && (
              <RouteRenderer pathCoordinates={pathCoordinates} />
            )}

            {userLocation && <AnimatedUserMarker position={userLocation} />}

            {filteredData.map((palace) => {
              if (
                !palace.baseLocation ||
                !palace.baseLocation.coordinates ||
                palace.baseLocation.coordinates.length !== 2
              )
                return null;

              return (
                <Marker
                  key={palace._id}
                  position={[
                    palace.baseLocation.coordinates[1],
                    palace.baseLocation.coordinates[0],
                  ]}
                  icon={createPartyPalaceIcon(
                    selectedPartyPalace === palace._id
                  )}
                  eventHandlers={{
                    click: () => setSelectedPartyPalace(palace._id),
                  }}
                >
                  <Popup minWidth={280} maxWidth={320}>
                    <div className="p-2 sm:p-3">
                      <div className="flex items-center space-x-2 sm:space-x-3 mb-3">
                        {palace.images && palace.images[0] && (
                          <img
                            src={palace.images[0]}
                            alt={palace.name}
                            className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover border-2 border-gray-200 shrink-0"
                            onError={(e) => {
                              e.target.src = "https://via.placeholder.com/50";
                            }}
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-gray-800 text-xs sm:text-sm truncate">
                            {palace.name}
                          </h3>
                          {palace.category && palace.category[0] && (
                            <span className="inline-block px-2 py-0.5 bg-purple-100 text-purple-800 text-xs rounded-full font-medium mt-1">
                              {palace.category[0]}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="space-y-1 sm:space-y-2 mb-3 text-xs sm:text-sm">
                        {palace.capacity && (
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-600">
                              Capacity:
                            </span>
                            <span className="text-gray-700">
                              {palace.capacity} guests
                            </span>
                          </div>
                        )}
                        {palace.pricePerHour && (
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-gray-600">
                              Price:
                            </span>
                            <span className="text-gray-700">
                              Rs. {palace.pricePerHour}/hour
                            </span>
                          </div>
                        )}
                        {userLocation &&
                          palace.baseLocation &&
                          palace.baseLocation.coordinates && (
                            <div className="flex items-center space-x-2">
                              <Navigation className="w-3 h-3 text-blue-500 shrink-0" />
                              <span className="text-gray-700">
                                {calculateDistance(
                                  userLocation.lat,
                                  userLocation.lng,
                                  palace.baseLocation.coordinates[1],
                                  palace.baseLocation.coordinates[0]
                                ).toFixed(2)}{" "}
                                km away
                              </span>
                            </div>
                          )}
                      </div>

                      <div className="flex space-x-2 gap-2">
                        <Link
                          to={`/booking/${palace._id}`}
                          className="flex flex-1 items-center justify-center bg-purple-600 text-white py-1.5 sm:py-2 px-2 sm:px-3 rounded-md text-xs font-medium hover:bg-purple-700 transition-colors"
                        >
                          <span className="text-white">Book</span>
                        </Link>

                        <button className="flex-1 bg-gray-100 text-gray-700 py-1.5 sm:py-2 px-2 sm:px-3 rounded-md text-xs font-medium hover:bg-gray-200 transition-colors">
                          Details
                        </button>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>
        ) : (
          <div className="w-full h-screen flex items-center justify-center bg-slate-950">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-200 font-medium">Loading Map...</p>
            </div>
          </div>
        )}
      </div>

      {/* Legend - Mobile Responsive */}
      <div className="fixed bottom-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-2 sm:p-3 max-w-xs text-xs sm:text-sm">
        <h3 className="font-semibold text-gray-800 mb-2">Legend</h3>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full border border-white shrink-0"></div>
            <span className="text-xs text-gray-700">Your Location</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-500 rounded-full border border-white shrink-0"></div>
            <span className="text-xs text-gray-700">Party Palace</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-pink-500 rounded-full border border-white shrink-0"></div>
            <span className="text-xs text-gray-700">Selected</span>
          </div>
        </div>
      </div>

      {/* Auto Path Status */}
      {isAnimating && (
        <div className="fixed bottom-4 right-4 z-[1000] bg-blue-100 border-2 border-blue-500 rounded-lg p-2 sm:p-3 max-w-xs text-xs sm:text-sm">
          <p className="text-blue-800 font-medium">Finding palace...</p>
        </div>
      )}

      {nearestPalace && !isAnimating && pathCoordinates.length > 0 && (
        <div className="fixed bottom-4 right-4 z-[1000] bg-green-100 border-2 border-green-500 rounded-lg p-2 sm:p-3 max-w-xs text-xs sm:text-sm">
          <p className="text-green-800 font-medium">
            {getSearchTypeLabel()}: {nearestPalace.name}
          </p>
          {nearestPalace.pricePerHour && (
            <p className="text-green-700 text-xs mt-1">
              Rs. {nearestPalace.pricePerHour}/hour
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default PartyPalaceMap;
