import React from "react";

/**
 * ProfessionalPaymentProgressBar
 * @param {number} totalPrice - Total price of the booking
 * @param {number} paidAmount - Amount paid so far
 */
const PaymentProgressBar = ({ totalPrice, paidAmount }) => {
  // Safety checks
  const safeTotal = totalPrice || 0;
  const safePaid = Math.min(paidAmount || 0, safeTotal);

  // Calculate progress percentage
  const progress = safeTotal > 0 ? (safePaid / safeTotal) * 100 : 0;

  // Determine color based on percentage
  let progressColor = "bg-red-500"; // default 0-20%
  if (progress > 20 && progress <= 40) progressColor = "bg-orange-500";
  else if (progress > 40 && progress <= 60) progressColor = "bg-yellow-400";
  else if (progress > 60 && progress <= 80) progressColor = "bg-lime-400";
  else if (progress > 80) progressColor = "bg-green-500";

  return (
    <div className="flex flex-col w-full">
      {/* Progress Bar */}
      <div className="w-full bg-neutral-800 rounded-full h-3 overflow-hidden border border-neutral-700">
        <div
          className={`${progressColor} h-full transition-all duration-500`}
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Payment info */}
      <div className="text-xs text-gray-300 mt-1 flex justify-between gap-2">
        <span>Paid: NPR {safePaid}</span>
        <span>Total: NPR {safeTotal}</span>
      </div>
    </div>
  );
};

export default PaymentProgressBar;
