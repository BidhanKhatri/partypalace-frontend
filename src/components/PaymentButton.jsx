import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { FaCreditCard } from "react-icons/fa";

const PaymentButton = ({ amount, userId, bookingId }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePayment = () => {
    setIsProcessing(true);

    const config = {
      publicKey: "YOUR_PUBLIC_KEY_HERE",
      productIdentity: bookingId,
      productName: "Party Palace Booking",
      productUrl: "https://yourapp.com",
      eventHandler: {
        onSuccess(payload) {
          console.log("Khalti payload:", payload);

          fetch("http://localhost:5000/api/khalti/verify", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: payload.token,
              amount: payload.amount,
              userId,
              bookingId,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              setIsProcessing(false);
              if (data.success) {
                alert("Payment Successful!");
              } else {
                alert("Payment Verification Failed!");
              }
            });
        },

        onError(error) {
          console.log(error);
          setIsProcessing(false);
        },

        onClose() {
          console.log("Khalti widget closed");
          setIsProcessing(false);
        },
      },
    };

    const checkout = new window.KhaltiCheckout(config);
    checkout.show({ amount: amount * 100 });
  };

  return (
    <>
      <Helmet>
        <script src="https://khalti.com/static/khalti-checkout.js"></script>
      </Helmet>

      <button
        onClick={handlePayment}
        disabled={isProcessing || !amount}
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
            Pay NPR {amount}
          </>
        )}
      </button>
    </>
  );
};

export default PaymentButton;
