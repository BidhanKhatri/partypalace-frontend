import React, { useState } from "react";
import {
  X,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Camera,
  Clock,
  Star,
} from "lucide-react";

import { toast } from "react-toastify";
import axios from "axios";

const CameraManBookingModal = ({ cameraMan, onClose }) => {
  console.log("selected cameraman", cameraMan);

  const [formData, setFormData] = useState({
    eventDate: "",
    eventTime: "",
    eventDuration: "",
    eventLocation: "",
    eventType: "",
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    specialRequests: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (formData.eventDate === "") {
        return toast.error("Please select a date");
      } else {
        const res = await axios.post("/proxy/api/cameraman/book-cameraman", {
          cameramanId: cameraMan._id,
          bookingDate: formData.eventDate,
        });

        if (res.data.success) {
          toast.success(res.data.message || "Cameraman booked successfully");
          onClose();
        }
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to book cameraman"
      );
    }
  };

  // Sample camera man data if not provided
  const defaultCameraMan = {
    _id: "686f804fb7b557bdaff4f158",
    name: "Sakshyam ",
    email: "sakshyam@gmail.com",
    mobile: "9809090786",
    profileImage:
      "https://res.cloudinary.com/dmg26epj0/image/upload/v1752137806/partypalace/ycbgdjaxz5ysryj6wapf.jpg",
    role: "cameraman",
    experienceYears: 3,
    baseLocation: {
      type: "Point",
      coordinates: [27.686545555780093, 85.31747704091569],
    },
    unavailableDates: ["2025-07-11T00:00:00.000Z"],
  };

  const currentCameraMan = cameraMan || defaultCameraMan;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img
                src={currentCameraMan.profileImage}
                alt={currentCameraMan.name}
                className="w-16 h-16 rounded-full object-scale-down border-3 border-white"
              />
              <div>
                <h2 className="text-2xl font-bold">
                  Book {currentCameraMan.name}
                </h2>
                <div className="flex items-center space-x-4 mt-2 text-blue-100">
                  <span className="flex items-center">
                    <Camera className="w-4 h-4 mr-1" />
                    Professional Cameraman
                  </span>
                  <span className="flex items-center">
                    <Star className="w-4 h-4 mr-1" />
                    {currentCameraMan.experienceYears} years experience
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => onClose()}
              className="text-white hover:text-gray-200 transition-colors cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-6">
          {/* Cameraman Info (Read-only) */}
          <div className="bg-gray-50 p-4 rounded-lg border">
            <h3 className="font-semibold text-gray-800 mb-3">
              Cameraman Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={currentCameraMan.name}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={currentCameraMan.email}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mobile
                </label>
                <input
                  type="tel"
                  value={currentCameraMan.mobile}
                  readOnly
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Base Location
                </label>
                <div className="flex items-center text-gray-700">
                  <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm">Kathmandu, Nepal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Event Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-800 text-lg">
              Event Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Event Date *
                </label>
                <input
                  type="date"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium shadow-lg"
            >
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CameraManBookingModal;
