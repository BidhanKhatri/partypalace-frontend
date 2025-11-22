import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaCreditCard, FaWallet } from "react-icons/fa";
import PaymentButton from "./PaymentButton";

const PaymentModal = ({ booking, onClose, onPaymentSuccess }) => {
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("khalti");
  const [isProcessing, setIsProcessing] = useState(false);

  const balanceDue = booking.totalPrice - booking.advancePaid;

  const handleFullPayment = () => {
    setPaymentAmount(balanceDue.toString());
  };

  const handlePartialPayment = (percentage) => {
    const amount = ((balanceDue * percentage) / 100).toFixed(2);
    setPaymentAmount(amount);
  };

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
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-lg flex items-center justify-center p-4 h-screen overflow-auto"
      >
        <motion.div
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
          className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-gray-900 to-black p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <FaCreditCard />
                  Make Payment
                </h1>
                <p className="text-gray-300">Complete your booking payment</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-amber-400 transition-colors text-xl"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Booking Summary */}
            <div className="mb-6 p-4 bg-gray-800 rounded-lg border border-gray-700">
              <h3 className="font-semibold text-white mb-2">Booking Summary</h3>
              <div className="space-y-1 text-sm">
                <p className="flex justify-between">
                  <span className="text-gray-300">Venue:</span>
                  <span className="font-medium text-white">
                    {booking.partyPalace?.name}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-300">Total Price:</span>
                  <span className="font-medium text-white">
                    NPR {booking.totalPrice}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-300">Advance Paid:</span>
                  <span className="font-medium text-green-400">
                    NPR {booking.advancePaid}
                  </span>
                </p>
                <p className="flex justify-between border-t border-gray-700 pt-1">
                  <span className="text-gray-200 font-semibold">
                    Balance Due:
                  </span>
                  <span className="font-bold text-amber-400">
                    NPR {balanceDue}
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Payment */}
            <div className="mb-6">
              <h3 className="font-semibold text-white mb-3">Quick Payment</h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleFullPayment}
                  className="bg-amber-700 hover:bg-amber-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                >
                  Pay Full Amount
                </button>
                <button
                  onClick={() => handlePartialPayment(50)}
                  className="bg-blue-700 hover:bg-blue-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                >
                  Pay 50%
                </button>
                <button
                  onClick={() => handlePartialPayment(25)}
                  className="bg-green-700 hover:bg-green-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                >
                  Pay 25%
                </button>
                <button
                  onClick={() => setPaymentAmount("")}
                  className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                >
                  Custom Amount
                </button>
              </div>
            </div>

            {/* Payment Amount */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Payment Amount (NPR)
              </label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
                max={balanceDue}
                className="w-full px-3 py-2 bg-gray-900 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                Maximum: NPR {balanceDue}
              </p>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Payment Method
              </label>
              <div className="space-y-2">
                {/* <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-amber-500 focus:ring-amber-500"
                  />
                  <FaCreditCard className="text-gray-300" />
                  <span className="text-gray-200">Credit/Debit Card</span>
                </label> */}

                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="khalti"
                    checked={paymentMethod === "khalti"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-amber-500 focus:ring-amber-500"
                  />
                  <FaWallet className="text-gray-300" />
                  <span className="text-gray-200">Khalti Wallet</span>
                </label>
              </div>
            </div>

            {/* Payment Summary */}
            {paymentAmount && (
              <div className="bg-gray-900 border border-amber-600 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-amber-400 mb-2">
                  Payment Summary
                </h4>
                <div className="space-y-1 text-sm">
                  <p className="flex justify-between">
                    <span className="text-gray-300">Payment Amount:</span>
                    <span className="font-semibold text-white">
                      NPR {paymentAmount}
                    </span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-300">Remaining Balance:</span>
                    <span className="font-semibold text-white">
                      NPR{" "}
                      {(balanceDue - parseFloat(paymentAmount || 0)).toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-800 p-4 bg-gray-900 flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 text-gray-400 hover:text-white font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>

            <PaymentButton
              amount={Number(paymentAmount)}
              userId={booking.userId}
              bookingId={booking._id}
            />
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentModal;
