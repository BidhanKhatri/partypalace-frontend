import React, { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { MapPin, Navigation, Zap, X } from "lucide-react";
import api from "../utils/apiInstance";

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
      // Create a FeatureGroup to hold all route layers
      const routeGroup = L.featureGroup();

      pathCoordinates.forEach((segment) => {
        if (segment && segment.length > 0) {
          // Draw polyline for each segment
          const polyline = L.polyline(segment, {
            color: "#3B82F6",
            weight: 4,
            opacity: 0.8,
            smoothFactor: 1.0,
            className: "route-line",
          }).addTo(routeGroup);
        }
      });

      // Add to map
      routeGroup.addTo(map);

      // Fit bounds to show the entire route
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
  const [isMobile, setIsMobile] = useState(false);
  const mapRef = useRef(null);
  const watchIdRef = useRef(null);

  // Request user location on component mount
  useEffect(() => {
    requestUserLocation();
    getAllPartyPalaces();
  }, []);

  // Apply filters
  useEffect(() => {
    applyFilters();
  }, [partyPalaceData, filterCapacity, filterRating]);

  // Cleanup watch on unmount
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
    const R = 6371; // Earth's radius in km
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

  // Fetch actual road route from OSRM API
  const fetchRoute = async (start, end) => {
    try {
      // Using Open Source Routing Machine (OSRM) for real road routing
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

  const zoomToNearest = async () => {
    if (!userLocation || filteredData.length === 0) {
      console.error("User location or palaces not available");
      return;
    }

    let nearest = null;
    let minDistance = Infinity;

    // Find nearest palace
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

    if (nearest && mapRef.current) {
      setIsAnimating(true);
      setNearestPalace(nearest);
      setSelectedPartyPalace(nearest._id);

      // Fetch actual route through roads
      const routeCoordinates = await fetchRoute(
        [userLocation.lat, userLocation.lng],
        [
          nearest.baseLocation.coordinates[1],
          nearest.baseLocation.coordinates[0],
        ]
      );

      if (routeCoordinates) {
        setPathCoordinates(routeCoordinates);
      } else {
        // Fallback to direct line if route fetching fails
        const pathCoords = [
          [userLocation.lat, userLocation.lng],
          [
            nearest.baseLocation.coordinates[1],
            nearest.baseLocation.coordinates[0],
          ],
        ];
        setPathCoordinates([pathCoords]);
      }

      console.log(`Nearest palace: ${nearest.name}`);

      // Auto zoom and fit bounds will be handled by RouteRenderer component
      setTimeout(() => {
        setIsAnimating(false);
      }, 1500);
    } else {
      console.error("No palaces found");
    }
  };

  const clearPath = () => {
    setPathCoordinates([]);
    setNearestPalace(null);
    setSelectedPartyPalace(null);
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading party palaces...</p>
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
          {/* <div>
            <label className="text-xs sm:text-sm font-medium text-gray-700 block mb-1">
              Min Rating
            </label>
            <input
              type="number"
              step="0.1"
              max="5"
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              placeholder="0 - 5"
              className="w-full px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-300 rounded-md text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div> */}
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

      {/* Map Controls - Mobile Responsive */}
      <div className="fixed top-14 md:top-20 right-4 z-[1000] space-y-2">
        <button
          onClick={zoomToNearest}
          disabled={isAnimating}
          className="bg-blue-600 p-2 sm:p-2.5 text-white rounded-md flex items-center gap-1 sm:gap-2 cursor-pointer hover:bg-blue-700 disabled:bg-blue-400 transition-all text-xs sm:text-sm font-medium"
          title="Find nearest party palace with auto path"
        >
          <Zap size={16} />
          <span className="hidden sm:inline">Nearest</span>
        </button>

        {pathCoordinates.length > 0 && (
          <button
            onClick={clearPath}
            className="bg-red-600 p-2 text-white rounded-md flex items-center gap-1 sm:gap-2 cursor-pointer hover:bg-red-700 transition-all text-xs sm:text-sm font-medium"
          >
            <X size={16} />
            <span className="hidden sm:inline">Clear</span>
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
            className="z-0 mt-10"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Render actual route through roads */}
            {pathCoordinates.length > 0 && (
              <RouteRenderer pathCoordinates={pathCoordinates} />
            )}

            {/* Animated User Location Marker */}
            {userLocation && <AnimatedUserMarker position={userLocation} />}

            {/* Party Palace Markers */}
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
                      {/* Header */}
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

                      {/* Details */}
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

                      {/* Action Buttons */}
                      <div className="flex space-x-2 gap-2">
                        <button className="flex-1 bg-purple-600 text-white py-1.5 sm:py-2 px-2 sm:px-3 rounded-md text-xs font-medium hover:bg-purple-700 transition-colors">
                          Book
                        </button>
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
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <p className="text-gray-600 font-medium">Loading map...</p>
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
          <p className="text-blue-800 font-medium">Finding nearest palace...</p>
        </div>
      )}

      {nearestPalace && !isAnimating && pathCoordinates.length > 0 && (
        <div className="fixed bottom-4 right-4 z-[1000] bg-green-100 border-2 border-green-500 rounded-lg p-2 sm:p-3 max-w-xs text-xs sm:text-sm">
          <p className="text-green-800 font-medium">
            Route to {nearestPalace.name}
          </p>
        </div>
      )}
    </div>
  );
};

export default PartyPalaceMap;
