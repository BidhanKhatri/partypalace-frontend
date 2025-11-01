import React, { useEffect, useState } from "react";
import { IoMdCloseCircle } from "react-icons/io";
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

import { FaLocationDot, FaMap } from "react-icons/fa6";
import { Link } from "react-router-dom";
import api from "../utils/apiInstance";
import CameraManBookingModal from "../components/CameraManBookingModal";

const CameraManPage = () => {
  const [loading, setLoading] = useState(false);
  const [coordinates, setCoordinates] = useState({
    lat: 27.7,
    lng: 85.3,
  });
  const [cameraManData, setCameraManData] = useState([]);
  const [cameraManModal, setCameraManModal] = useState(false);
  const [selectedCameraMan, setSelectedCameraMan] = useState(null);

  useEffect(() => {
    getAllCameraMan();
  }, []);

  // api call to get all camera man
  const getAllCameraMan = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/cameraman/get-all");

      if (res && res.data.success) {
        setCameraManData(res.data.data);
      } else {
        toast.error(res.data.msg);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // Handle coordinate change and search
  const handleSearch = () => {
    if (coordinates.lat && coordinates.lng) {
      fetchCameramen(coordinates.lat, coordinates.lng);
    } else {
      setError("Please enter valid coordinates");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-20 w-20 border-b-2 border-blue-700" />
        <p>Cameramen are loading...</p>
      </div>
    );
  }

  //function to toggle cameraman

  const toggleBookCameraMan = (cameraMan = null) => {
    if (cameraMan) {
      setSelectedCameraMan(cameraMan);
      setCameraManModal(true);
    } else {
      setSelectedCameraMan(null);
      setCameraManModal(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-6 mt-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Available Cameramen
        </h2>
        <div
          className={` bg-neutral-50 mb-4 rounded-md p-2 flex flex-row justify-end items-center gap-4`}
        >
          <span>
            <Link
              to="/nearest-cameraman"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105 duration-300 cursor-pointer ease-in-out flex flex-row items-center gap-2"
            >
              <FaLocationDot /> Find Nearest Cameraman
            </Link>
          </span>

          <span>
            <Link
              to="/cameraman-mapview"
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all hover:scale-105 duration-300 cursor-pointer ease-in-out flex flex-row items-center gap-2"
            >
              <FaMap /> Map View
            </Link>
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {cameraManData.map((cameraman) => (
          <div
            key={cameraman._id}
            className={`bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-neutral-200 overflow-hidden `}
          >
            {/* Profile Image */}
            <div className="relative bg-neutral-100">
              <img
                src={cameraman.profileImage}
                alt={cameraman.name}
                className="w-full h-48 object-scale-down rounded-t-xl"
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

              {/* Action Buttons */}
              <div className="flex space-x-2 mt-4">
                <button
                  onClick={() => toggleBookCameraMan(cameraman)}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
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

      {cameraManModal && (
        <CameraManBookingModal
          cameraMan={selectedCameraMan}
          onClose={toggleBookCameraMan}
        />
      )}
    </div>
  );
};

export default CameraManPage;
