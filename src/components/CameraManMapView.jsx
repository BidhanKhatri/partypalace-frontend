import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Camera, Phone, Mail, Award, Calendar } from "lucide-react";
import { FaArrowLeft } from "react-icons/fa6";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

// Custom marker icon
const createCustomIcon = (isSelected = false) => {
  return L.divIcon({
    html: `
      <div style="
        background: ${isSelected ? "#3B82F6" : "#10B981"};
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
          <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
          <circle cx="12" cy="13" r="3"/>
        </svg>
      </div>
    `,
    className: "custom-marker",
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });
};

const CameraManMapView = () => {
  const [selectedCameraman, setSelectedCameraman] = useState(null);

  const [cameraManData, setCameraManData] = useState([]);

  // console.log("cameraman data", cameraManData);

  useEffect(() => {
    getAllCameraMan();
  }, []);

  // api call to get all camera man
  const getAllCameraMan = async () => {
    try {
      const res = await axios.get("/proxy/api/cameraman/get-all");

      if (res && res.data.success) {
        setCameraManData(res.data.data);
      } else {
        toast.error(res.data.msg);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const formatPhoneNumber = (phone) => {
    return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  };

  const getExperienceColor = (years) => {
    if (years >= 5) return "text-green-600";
    if (years >= 3) return "text-yellow-600";
    return "text-blue-600";
  };

  return (
    <>
      <Navbar />
      <div className="w-full h-screen overflow-hidden bg-gray-100 relative">
        {/* Header - Fixed positioning to prevent layout shift */}
        <div className="fixed top-20 left-4 right-4 sm:right-auto sm:max-w-md z-[1000] bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg shrink-0">
              <Camera className="w-6 h-6 text-blue-600" />
            </div>
            <div className="min-w-0">
              <h1 className="text-xl font-bold text-gray-800 truncate">
                Cameraman Locations
              </h1>
              <p className="text-sm text-gray-600">
                {cameraManData.length} cameramen available
              </p>
            </div>
          </div>  
        </div>

        {/* Map Container - Full screen with proper overflow handling */}
        <div className="w-full h-full">
          <MapContainer
            center={[27.632418, 85.362488]} // Centered on Kathmandu
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            className="z-0"
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {cameraManData.map((cameraman) => (
              <Marker
                key={cameraman._id}
                position={[
                  cameraman.baseLocation.coordinates[0],
                  cameraman.baseLocation.coordinates[1],
                ]}
                icon={createCustomIcon(selectedCameraman === cameraman._id)}
                eventHandlers={{
                  click: () => setSelectedCameraman(cameraman._id),
                }}
              >
                <Popup className="custom-popup" minWidth={280} maxWidth={320}>
                  <div className="p-2">
                    {/* Header */}
                    <div className="flex items-center space-x-3 mb-3">
                      <img
                        src={cameraman.profileImage}
                        alt={cameraman.name}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-800 text-lg truncate">
                          {cameraman.name}
                        </h3>
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full font-medium">
                          {cameraman.role}
                        </span>
                      </div>
                    </div>

                    {/* Experience */}
                    <div className="flex items-center space-x-2 mb-3">
                      <Award className="w-4 h-4 text-gray-500 shrink-0" />
                      <span
                        className={`text-sm font-medium ${getExperienceColor(
                          cameraman.experienceYears
                        )}`}
                      >
                        {cameraman.experienceYears} years experience
                      </span>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-2 mb-3">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-4 h-4 text-gray-500 shrink-0" />
                        <span className="text-sm text-gray-700 truncate">
                          {formatPhoneNumber(cameraman.mobile)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Mail className="w-4 h-4 text-gray-500 shrink-0" />
                        <span className="text-sm text-gray-700 truncate">
                          {cameraman.email}
                        </span>
                      </div>
                    </div>

                    {/* Availability Status */}
                    <div className="flex items-center space-x-2 mb-3">
                      <Calendar className="w-4 h-4 text-gray-500 shrink-0" />
                      <span className="text-sm text-gray-700">
                        {cameraman.unavailableDates.length === 0 ? (
                          <span className="text-green-600 font-medium">
                            Available
                          </span>
                        ) : (
                          <span className="text-red-600 font-medium">
                            {cameraman.unavailableDates.length} unavailable
                            dates
                          </span>
                        )}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      <button className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                        Book Now
                      </button>
                      <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-md text-sm font-medium hover:bg-gray-200 transition-colors">
                        View Profile
                      </button>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Legend - Fixed positioning with responsive design */}
        <div className="fixed bottom-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-4 max-w-xs">
          <h3 className="font-semibold text-gray-800 mb-2">Legend</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-emerald-500 rounded-full border-2 border-white shadow-sm shrink-0"></div>
              <span className="text-sm text-gray-700">Available Cameraman</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-sm shrink-0"></div>
              <span className="text-sm text-gray-700">Selected Cameraman</span>
            </div>
          </div>
        </div>

        {/* back to cameraman button */}
        <span className="absolute top-20 right-4 z-[1000]">
          <Link
            to="/cameraman"
            className="bg-black p-2 text-white rounded-md flex flex-row items-center gap-2 cursor-pointer hover:scale-105 transition-all duration-500 ease-in-out "
          >
            <FaArrowLeft size={20} />
            Cameraman Page
          </Link>
        </span>
      </div>
    </>
  );
};

export default CameraManMapView;
