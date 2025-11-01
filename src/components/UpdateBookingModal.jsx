import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import userContext from "../context/userContext";
import { useSelector } from "react-redux";

const UpdateBookingModal = ({ prevBookingData, setPrevBookingData, close }) => {
  const { partypalace } = useSelector((state) => state?.partypalace);
  const { fetchAllPartyPalace, updateBooking, getBookingData, loading } =
    useContext(userContext);

  const [data, setData] = useState({
    bookingId: prevBookingData._id,
    partyPalaceId: prevBookingData?.partyPalace?._id || "",
    bookingDate:
      new Date(prevBookingData?.bookingDate).toISOString().split("T")[0] || "",
    hoursBooked: prevBookingData.hoursBooked || 1,
    totalPrice: prevBookingData.totalPrice || 0,
  });

  useEffect(() => {
    fetchAllPartyPalace();
  }, []);

  const filterCurrentPrice = partypalace.find(
    (el) => el?._id === data?.partyPalaceId
  );

  useEffect(() => {
    if (filterCurrentPrice) {
      setData((prev) => ({
        ...prev,
        totalPrice: filterCurrentPrice.pricePerHour * prev.hoursBooked,
      }));
    }
  }, [data.hoursBooked, data.partyPalaceId, filterCurrentPrice]);

  const handleUpdateChange = (e) => {
    const { name, value, type } = e.target;
    const newValue = type === "number" ? Number(value) : value;

    setData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    setPrevBookingData((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    await updateBooking(data);

    if (close) {
      close();
    }
  };

  return (
    <AnimatePresence>
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={close}
        className="fixed z-50 bg-black/70 inset-0 w-full h-screen flex items-center justify-center p-4"
      >
        <motion.form
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          onSubmit={handleUpdateSubmit}
          className="bg-gray-800 border border-gray-600 rounded-lg w-full max-w-sm p-4 space-y-4"
        >
          {/* Header */}
          <div className="text-center">
            <h2 className="text-lg font-semibold text-white">Update Booking</h2>
          </div>

          {/* Form Fields */}
          <div className="space-y-3">
            {/* Party Palace Selection */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Venue</label>
              <select
                onChange={handleUpdateChange}
                name="partyPalaceId"
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white text-sm"
                value={data.partyPalaceId || ""}
              >
                <option value="">Select Venue</option>
                {partypalace.length > 0 &&
                  partypalace.map((pp, i) => (
                    <option key={i} value={pp._id}>
                      {pp.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* Date Selection */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Date</label>
              <input
                type="date"
                name="bookingDate"
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white text-sm"
                value={data.bookingDate}
                onChange={handleUpdateChange}
              />
            </div>

            {/* Hours Booked */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">Hours</label>
              <input
                type="number"
                min="1"
                max="12"
                name="hoursBooked"
                className="w-full bg-gray-700 border border-gray-600 rounded p-2 text-white text-sm"
                onChange={handleUpdateChange}
                value={data.hoursBooked}
              />
            </div>

            {/* Total Price */}
            <div>
              <label className="block text-sm text-gray-300 mb-1">
                Total Price
              </label>
              <input
                type="number"
                name="totalPrice"
                className="w-full bg-gray-600 border border-gray-500 rounded p-2 text-yellow-400 text-sm font-medium"
                readOnly
                value={data.totalPrice}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={close}
              className="flex-1 bg-gray-600 hover:bg-gray-500 text-white rounded p-2 text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white rounded p-2 text-sm transition-colors disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </motion.form>
      </motion.section>
    </AnimatePresence>
  );
};

export default UpdateBookingModal;
