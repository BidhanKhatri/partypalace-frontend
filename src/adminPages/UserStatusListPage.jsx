import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import adminContext from "../context/adminContext";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const UserStatusListPage = () => {
  const location = useLocation();
  const { fetchUserBookingData, userBookingData, updateUserBookingStatus } =
    useContext(adminContext);
  const { token, userId } = useSelector((state) => state?.user);

  const [status, setStatus] = useState("");
  const [bookingId, setBookingId] = useState("");
  const [partyPalaceId, setPartyPalaceId] = useState("");

  const ppId = location.state?.partyPalaceId;

  // ✅ fetch booking data for this palace only
  useEffect(() => {
    if (token && userId && ppId) {
      fetchUserBookingData(ppId);
    }
  }, [token, userId, ppId]);

  // ✅ extract bookings for this specific palace
  const bookings = userBookingData?.[ppId] || [];

  const handleStatusChange = () => {
    const payload = {
      bookingId,
      status,
      partyPalaceId: ppId,
    };

    if (bookingId) {
      updateUserBookingStatus(payload);
    } else {
      toast.error("bookingId is required");
    }
  };

  return (
    <div>
      <div>
        {bookings.length > 0 ? (
          bookings.map((el) => (
            <div
              key={el._id}
              className="w-full rounded-md shadow-md p-4 mt-2 flex gap-4 items-center justify-between"
            >
              {/* user image */}
              <div>
                <img
                  src={el.user?.profilePic || ""}
                  alt="User"
                  className="size-14 rounded-md bg-neutral-200 object-cover border border-neutral-500"
                />
              </div>

              {/* user name */}
              <div>
                <p className="mb-1 font-semibold">👤User Name</p>
                <span>{el.user?.username}</span>
              </div>

              {/* palace name */}
              <div>
                <p className="mb-1 font-semibold">🏠Party Palace Name</p>
                <span>{el.partyPalace?.name}</span>
              </div>

              {/* booking date */}
              <div>
                <p className="mb-1 font-semibold">🔖Booking Date</p>
                <span>
                  {new Date(el.bookingDate).toISOString().split("T")[0]}
                </span>
              </div>

              {/* total capacity */}
              <div>
                <p className="mb-1 font-semibold">Guests</p>
                <span>{el?.totalCapacity || 0}</span>
              </div>

              {/* total price */}
              <div>
                <p className="mb-1 font-semibold">💸Total Price</p>
                <span>{el.totalPrice}</span>
              </div>

              {/* status section */}
              <div>
                <p className="mb-1 font-semibold">Status</p>
                <select
                  onClick={() => {
                    setBookingId(el._id);
                    setPartyPalaceId(ppId);
                  }}
                  onChange={(e) => {
                    setStatus(e.target.value);
                  }}
                  className={`border rounded-md px-2 py-1 ${
                    el.status === "confirmed"
                      ? "text-green-700 bg-green-100"
                      : "text-red-700 bg-red-100"
                  }`}
                >
                  <option value={el.status}>{el.status}</option>
                  <option value="confirmed" onClick={handleStatusChange}>
                    Confirm
                  </option>
                  <option value="pending" onClick={handleStatusChange}>
                    Pending
                  </option>
                </select>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-red-500 bg-red-100 p-4">
            No Booking Details Found
          </p>
        )}
      </div>
    </div>
  );
};

export default UserStatusListPage;
