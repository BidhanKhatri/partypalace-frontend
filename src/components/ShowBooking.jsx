import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import userContext from "../context/userContext";
import UpdateBookingModal from "./UpdateBookingModal";

const ShowBooking = ({ close, isBookOpen }) => {
  const { bookingData, getBookingData, handleCancel } = useContext(userContext);

  const [isModelOpen, setIsModelOpen] = useState(false);
  const [prevBookingData, setPrevBookingData] = useState({});
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
                  Party Palace Booking Details
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

                <div className="flex flex-col gap-6 overflow-y-auto custom-scrollbar">
                  {/* Party Palace Bookings Section */}
                  <div className="space-y-4">
                    <motion.p
                      variants={itemVariants}
                      className="font-semibold text-xl text-white mb-4"
                    >
                      Party Palace Bookings
                    </motion.p>

                    <div className="space-y-4 max-h-[50vh] overflow-y-auto custom-scrollbar">
                      {bookingData?.map((el, i) => (
                        <motion.div
                          key={el?._id}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          transition={{ delay: i * 0.1 }}
                          className="flex items-center gap-4 p-4 border border-gray-700 bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:border-gray-600"
                        >
                          {/* Image */}
                          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-700 flex-shrink-0">
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
                          <div className="flex-1 min-w-0">
                            <p className="text-lg font-semibold text-white truncate">
                              {el.partyPalace?.name}
                            </p>
                            <p className="text-sm text-gray-400 truncate">
                              {el.partyPalace?.location}
                            </p>
                          </div>

                          {/* Booking Details */}
                          <div className="flex items-center gap-4">
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
                              <p className="text-sm text-gray-400">Hrs</p>
                              <p className="text-xs font-medium text-white">
                                {el?.hoursBooked}
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

                            <div className="flex flex-col gap-2">
                              {/* Update button */}
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
    </>
  );
};

export default ShowBooking;
