import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import userContext from "../context/userContext";
import UpdateBookingModal from "./UpdateBookingModal";
import {
  FaLocationPin,
  FaDownload,
  FaEye,
  FaCreditCard,
} from "react-icons/fa6";
import PaymentProgressBar from "./PaymentProgressbar";
import ReceiptModal from "./ReceiptModal";
import PaymentModal from "./PaymentModal";

const ShowBooking = ({ close, isBookOpen }) => {
  const { bookingData, getBookingData, handleCancel } = useContext(userContext);

  const [isModelOpen, setIsModelOpen] = useState(false);
  const [prevBookingData, setPrevBookingData] = useState({});
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  console.log(bookingData);

  useEffect(() => {
    getBookingData();
  }, []);

  useEffect(() => {
    if (isBookOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => (document.body.style.overflow = "auto");
  }, [isBookOpen]);

  const toggleUpdate = (el) => {
    setIsModelOpen((prev) => !prev);
    setPrevBookingData(el);
  };

  const handlePreviewReceipt = (booking) => {
    setSelectedBooking(booking);
    setIsReceiptModalOpen(true);
  };

  const handleOpenPayment = (booking) => {
    setSelectedBooking(booking);
    setIsPaymentModalOpen(true);
  };

  const handleDownloadReceipt = async (booking) => {
    try {
      // Using html2pdf for PDF generation
      const html2pdf = (await import("html2pdf.js")).default;

      const receiptElement = document.createElement("div");
      receiptElement.innerHTML = `
        <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px;">
          <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #333; padding-bottom: 10px;">
            <h1 style="color: #2563eb; margin: 0; font-size: 28px;">Party Palace Booking</h1>
            <p style="color: #666; margin: 5px 0; font-size: 14px;">Booking Receipt</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h2 style="color: #333; margin-bottom: 10px; font-size: 20px;">${
              booking.partyPalace?.name
            }</h2>
            <p style="color: #666; margin: 5px 0; font-size: 14px;">
              <strong>Location:</strong> ${booking.partyPalace?.location}
            </p>
          </div>

          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-bottom: 15px; font-size: 16px;">Booking Details</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <p style="margin: 5px 0; font-size: 14px;"><strong>Booking ID:</strong></p>
                <p style="margin: 5px 0; font-size: 14px;"><strong>Booking Date:</strong></p>
                <p style="margin: 5px 0; font-size: 14px;"><strong>Number of Guests:</strong></p>
                <p style="margin: 5px 0; font-size: 14px;"><strong>Status:</strong></p>
              </div>
              <div>
                <p style="margin: 5px 0; font-size: 14px;">${booking._id}</p>
                <p style="margin: 5px 0; font-size: 14px;">${new Date(
                  booking.bookingDate
                ).toLocaleDateString()}</p>
                <p style="margin: 5px 0; font-size: 14px;">${
                  booking.guestCount
                }</p>
                <p style="margin: 5px 0; font-size: 14px; color: #16a34a; font-weight: bold; text-transform: capitalize;">${
                  booking.status
                }</p>
              </div>
            </div>
          </div>

          <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="color: #333; margin-bottom: 15px; font-size: 16px;">Payment Information</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
              <div>
                <p style="margin: 5px 0; font-size: 14px;"><strong>Total Price:</strong></p>
                <p style="margin: 5px 0; font-size: 14px;"><strong>Advance Paid:</strong></p>
                <p style="margin: 5px 0; font-size: 14px;"><strong>Balance Due:</strong></p>
              </div>
              <div>
                <p style="margin: 5px 0; font-size: 14px;">NPR ${
                  booking.totalPrice
                }</p>
                <p style="margin: 5px 0; font-size: 14px;">NPR ${
                  booking.advancePaid
                }</p>
                <p style="margin: 5px 0; font-size: 14px; font-weight: bold;">NPR ${
                  booking.totalPrice - booking.advancePaid
                }</p>
              </div>
            </div>
          </div>

          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 12px; margin: 5px 0;">
              Thank you for your booking!
            </p>
            <p style="color: #999; font-size: 10px; margin: 5px 0;">
              Generated on ${new Date().toLocaleDateString()}
            </p>
          </div>
        </div>
      `;

      const options = {
        margin: 10,
        filename: `booking-receipt-${booking._id}.pdf`,
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      };

      html2pdf().set(options).from(receiptElement).save();
    } catch (error) {
      console.error("Error generating PDF:", error);
      // Fallback to simple text download if PDF generation fails
      const receiptContent = `
        BOOKING RECEIPT
        ========================
        
        Party Palace: ${booking.partyPalace?.name}
        Location: ${booking.partyPalace?.location}
        
        Booking Details:
        - Booking ID: ${booking._id}
        - Date: ${new Date(booking.bookingDate).toLocaleDateString()}
        - Guests: ${booking.guestCount}
        - Total Price: NPR ${booking.totalPrice}
        - Advance Paid: NPR ${booking.advancePaid}
        - Balance Due: NPR ${booking.totalPrice - booking.advancePaid}
        - Status: ${booking.status}
        
        Thank you for your booking!
        Generated on ${new Date().toLocaleDateString()}
      `;

      const blob = new Blob([receiptContent], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `booking-receipt-${booking._id}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const panelVariants = {
    hidden: { x: "100%", opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 200,
      },
    },
    exit: {
      x: "100%",
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
      },
    },
  };

  return (
    <>
      <AnimatePresence>
        {isBookOpen && (
          <motion.section
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={close}
            className="fixed inset-0 w-full z-10 bg-black/70 text-gray-200 h-screen"
          >
            <motion.div
              variants={panelVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 absolute right-0 h-full w-full md:w-[50%]  p-6 shadow-2xl"
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-700">
                <p className="font-semibold text-2xl text-white">
                  Booking Details
                </p>
                <motion.span
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={close}
                  className="text-3xl cursor-pointer select-none text-gray-400 hover:text-white transition-colors"
                >
                  &times;
                </motion.span>
              </div>

              {/* Content */}
              <div className="mt-4 flex flex-col gap-6 h-[calc(100vh-120px)]">
                {bookingData.length === 0 && (
                  <motion.div
                    variants={itemVariants}
                    className="text-center text-gray-400 py-8"
                  >
                    No Booking Found
                  </motion.div>
                )}

                <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar ">
                  {/* Party Palace Bookings Section */}
                  <div className="space-y-4">
                    <motion.p
                      variants={itemVariants}
                      className="font-semibold text-xl text-white mb-4"
                    >
                      Palace Bookings
                    </motion.p>

                    <div className="space-y-4  overflow-y-auto pr-2 custom-scrollbar">
                      {bookingData?.map((el, i) => (
                        <motion.div
                          key={el?._id}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: i * 0.1 }}
                          className="flex flex-col sm:flex-row sm:flex-wrap sm:justify-between sm:items-center gap-4 p-4 border border-gray-700 bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-gray-600 w-full"
                        >
                          {/* Image */}
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0 mx-auto sm:mx-0">
                            <img
                              src={
                                el.partyPalace?.images[0] ||
                                "https://via.placeholder.com/400"
                              }
                              alt={el.partyPalace?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Party Palace Details */}
                          <div className="flex-1 min-w-0 text-center sm:text-left">
                            <p className="text-lg font-semibold text-white truncate">
                              {el.partyPalace?.name}
                            </p>
                            <p className="text-sm text-gray-400 truncate rounded-md mt-1 flex items-center justify-center gap-1 px-2 py-1 w-fit mx-auto sm:mx-0">
                              <FaLocationPin /> {el.partyPalace?.location}
                            </p>
                          </div>

                          {/* Booking Details */}
                          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4 flex-1">
                            <div className="text-center">
                              <p className="text-sm text-gray-400">📅 Date</p>
                              <p className="text-xs font-medium text-white">
                                {
                                  new Date(el?.bookingDate)
                                    .toISOString()
                                    .split("T")[0]
                                }
                              </p>
                            </div>

                            <div className="text-center">
                              <p className="text-sm text-gray-400">👥 Guests</p>
                              <p className="text-xs font-medium text-white">
                                {el?.guestCount}
                              </p>
                            </div>

                            <div className="text-center">
                              <p className="text-sm text-gray-400">💰 Price</p>
                              <p className="text-xs font-medium text-white">
                                NPR {el?.totalPrice}
                              </p>
                            </div>

                            <div className="text-center">
                              <p className="text-sm text-gray-400">📌 Status</p>
                              <span
                                className={`px-3 py-1 text-xs font-medium rounded-full ${
                                  el.status === "confirmed"
                                    ? "bg-green-900/30 text-green-400 border border-green-800"
                                    : "bg-yellow-900/30 text-yellow-400 border border-yellow-800"
                                }`}
                              >
                                {el?.status}
                              </span>
                            </div>
                            <div>
                              <PaymentProgressBar
                                totalPrice={el?.totalPrice}
                                paidAmount={el?.advancePaid}
                              />
                            </div>
                          </div>

                          {/* Payment Status */}
                          <div className="w-full bg-gray-700 rounded-lg p-3">
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm text-gray-300">
                                Payment Progress
                              </span>
                              <span className="text-sm font-medium text-white">
                                NPR {el?.advancePaid} / NPR {el?.totalPrice}
                              </span>
                            </div>
                            <div className="w-full bg-gray-600 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full transition-all duration-300"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    (el?.advancePaid / el?.totalPrice) * 100
                                  )}%`,
                                }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                              <span>Paid: NPR {el?.advancePaid}</span>
                              <span>
                                Due: NPR {el?.totalPrice - el?.advancePaid}
                              </span>
                            </div>
                          </div>

                          {/* Buttons */}
                          <div className="flex flex-row flex-wrap gap-2 justify-center sm:justify-end w-full">
                            {/* Update Button */}
                            {el?.status !== "confirmed" && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => toggleUpdate(el)}
                                className="bg-green-600 hover:bg-green-700 cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg"
                              >
                                Update
                              </motion.button>
                            )}

                            {/* Payment Button - Show if there's balance due */}
                            {el?.totalPrice - el?.advancePaid > 0 && (
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleOpenPayment(el)}
                                className="bg-amber-600 hover:bg-amber-700 cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg flex items-center gap-2"
                              >
                                <FaCreditCard className="text-xs" />
                                Make Payment
                              </motion.button>
                            )}

                            {/* Receipt Buttons - Only for confirmed status */}
                            {el?.status === "confirmed" && (
                              <>
                                {/* Preview Button */}
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handlePreviewReceipt(el)}
                                  className="bg-purple-600 hover:bg-purple-700 cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg flex items-center gap-2"
                                >
                                  <FaEye className="text-xs" />
                                  Preview
                                </motion.button>

                                {/* Download Button */}
                                <motion.button
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => handleDownloadReceipt(el)}
                                  className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg flex items-center gap-2"
                                >
                                  <FaDownload className="text-xs" />
                                  PDF
                                </motion.button>
                              </>
                            )}

                            {/* Cancel Button */}
                            <motion.button
                              whileHover={{
                                scale: el.status !== "confirmed" ? 1.05 : 1,
                              }}
                              whileTap={{
                                scale: el.status !== "confirmed" ? 0.95 : 1,
                              }}
                              onClick={() => handleCancel(el._id)}
                              disabled={el.status === "confirmed"}
                              className={`${
                                el?.status === "confirmed"
                                  ? "bg-gray-700 cursor-not-allowed text-gray-400"
                                  : "bg-red-600 hover:bg-red-700 cursor-pointer text-white"
                              } px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg`}
                            >
                              Cancel
                            </motion.button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      {isModelOpen && (
        <UpdateBookingModal
          prevBookingData={prevBookingData}
          setPrevBookingData={setPrevBookingData}
          close={toggleUpdate}
        />
      )}

      {isReceiptModalOpen && selectedBooking && (
        <ReceiptModal
          booking={selectedBooking}
          onClose={() => setIsReceiptModalOpen(false)}
          onDownload={() => handleDownloadReceipt(selectedBooking)}
        />
      )}

      {isPaymentModalOpen && selectedBooking && (
        <PaymentModal
          booking={selectedBooking}
          onClose={() => setIsPaymentModalOpen(false)}
          onPaymentSuccess={() => {
            setIsPaymentModalOpen(false);
            getBookingData(); // Refresh booking data
          }}
        />
      )}
    </>
  );
};

export default ShowBooking;
