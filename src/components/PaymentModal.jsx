import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaTimes, FaCreditCard, FaWallet } from "react-icons/fa";

const PaymentModal = ({ booking, onClose, onPaymentSuccess }) => {
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);

  const balanceDue = booking.totalPrice - booking.advancePaid;

  const handlePayment = async () => {
    if (!paymentAmount || paymentAmount <= 0) {
      alert("Please enter a valid payment amount");
      return;
    }

    if (paymentAmount > balanceDue) {
      alert("Payment amount cannot exceed the balance due");
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    try {
      // Here you would integrate with your actual payment gateway
      // For now, we'll simulate a successful payment
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Call your payment API here
      console.log("Processing payment:", {
        bookingId: booking._id,
        amount: paymentAmount,
        method: paymentMethod,
      });

      // Simulate API call
      // await makePayment(booking._id, paymentAmount, paymentMethod);

      alert(`Payment of NPR ${paymentAmount} processed successfully!`);
      onPaymentSuccess();
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

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
        className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 h-screen overflow-auto"
      >
        <motion.div
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden "
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-amber-600 to-orange-600 p-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <FaCreditCard />
                  Make Payment
                </h1>
                <p className="text-amber-100">Complete your booking payment</p>
              </div>
              <button
                onClick={onClose}
                className="text-white hover:text-amber-200 transition-colors text-xl"
              >
                <FaTimes />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* Booking Summary */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold text-gray-800 mb-2">
                Booking Summary
              </h3>
              <div className="space-y-1 text-sm">
                <p className="flex justify-between">
                  <span className="text-gray-600">Venue:</span>
                  <span className="font-medium">
                    {booking.partyPalace?.name}
                  </span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Total Price:</span>
                  <span className="font-medium">NPR {booking.totalPrice}</span>
                </p>
                <p className="flex justify-between">
                  <span className="text-gray-600">Advance Paid:</span>
                  <span className="font-medium text-green-600">
                    NPR {booking.advancePaid}
                  </span>
                </p>
                <p className="flex justify-between border-t border-gray-200 pt-1">
                  <span className="text-gray-800 font-semibold">
                    Balance Due:
                  </span>
                  <span className="font-bold text-amber-600">
                    NPR {balanceDue}
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Payment Options */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-800 mb-3">
                Quick Payment
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleFullPayment}
                  className="bg-amber-100 hover:bg-amber-200 text-amber-800 py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                >
                  Pay Full Amount
                </button>
                <button
                  onClick={() => handlePartialPayment(50)}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                >
                  Pay 50%
                </button>
                <button
                  onClick={() => handlePartialPayment(25)}
                  className="bg-green-100 hover:bg-green-200 text-green-800 py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                >
                  Pay 25%
                </button>
                <button
                  onClick={() => setPaymentAmount("")}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-3 rounded-lg text-sm font-medium transition-colors"
                >
                  Custom Amount
                </button>
              </div>
            </div>

            {/* Payment Amount */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payment Amount (NPR)
              </label>
              <input
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter amount"
                min="1"
                max={balanceDue}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Maximum: NPR {balanceDue}
              </p>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Payment Method
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <FaCreditCard className="text-gray-600" />
                  <span className="text-gray-700">Credit/Debit Card</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="digital"
                    checked={paymentMethod === "digital"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="text-amber-600 focus:ring-amber-500"
                  />
                  <FaWallet className="text-gray-600" />
                  <span className="text-gray-700">Digital Wallet</span>
                </label>
              </div>
            </div>

            {/* Payment Summary */}
            {paymentAmount && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-amber-800 mb-2">
                  Payment Summary
                </h4>
                <div className="space-y-1 text-sm">
                  <p className="flex justify-between">
                    <span className="text-amber-700">Payment Amount:</span>
                    <span className="font-semibold">NPR {paymentAmount}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-amber-700">Remaining Balance:</span>
                    <span className="font-semibold">
                      NPR{" "}
                      {(balanceDue - parseFloat(paymentAmount || 0)).toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={isProcessing || !paymentAmount}
              className="px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : (
                <>
                  <FaCreditCard />
                  Pay NPR {paymentAmount || "0"}
                </>
              )}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PaymentModal;
