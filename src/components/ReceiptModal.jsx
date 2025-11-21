import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaDownload, FaTimes } from "react-icons/fa";

const ReceiptModal = ({ booking, onClose, onDownload }) => {
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200,
      },
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 h-screen overflow-auto"
      >
        <motion.div
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden "
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-400 to-orange-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">Party Palace Booking</h1>
                <p className="text-blue-100">Booking Receipt</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-blue-200 transition-colors text-xl"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Venue Info */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {booking.partyPalace?.name}
              </h2>
              <p className="text-gray-600 flex items-center gap-2">
                <span>📍</span>
                {booking.partyPalace?.location}
              </p>
            </div>

            {/* Booking Details */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">
                Booking Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Booking ID</p>
                  <p className="font-medium text-gray-800">{booking._id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Booking Date</p>
                  <p className="font-medium text-gray-800">
                    {new Date(booking.bookingDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Number of Guests</p>
                  <p className="font-medium text-gray-800">
                    {booking.guestCount}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                    {booking.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div className="bg-green-50 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">
                Payment Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Total Price</p>
                  <p className="font-bold text-lg text-gray-800">
                    NPR {booking.totalPrice}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Advance Paid</p>
                  <p className="font-bold text-lg text-green-600">
                    NPR {booking.advancePaid}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Balance Due</p>
                  <p className="font-bold text-lg text-blue-600">
                    NPR {booking.totalPrice - booking.advancePaid}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Payment Progress</p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (booking.advancePaid / booking.totalPrice) * 100
                        }%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    {Math.round(
                      (booking.advancePaid / booking.totalPrice) * 100
                    )}
                    % Paid
                  </p>
                </div>
              </div>
            </div>

            {/* Footer Note */}
            <div className="text-center border-t border-gray-200 pt-4">
              <p className="text-gray-600 text-sm">
                Thank you for your booking! We look forward to serving you.
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Generated on {new Date().toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Close
            </button>
            <button
              onClick={onDownload}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
            >
              <FaDownload />
              Download PDF
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReceiptModal;
