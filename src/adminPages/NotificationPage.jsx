import React, { useContext, useEffect } from "react";
import adminContext from "../context/adminContext";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { IoMdArrowBack } from "react-icons/io";

const NotificationPage = () => {
  const {
    getMyPartyPalace,
    myPartyPalaceData,
    fetchUserBookingData,
    userBookingData,
  } = useContext(adminContext);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    getMyPartyPalace();
  }, [location.pathname]);

  useEffect(() => {
    // Fetch bookings for all owned party palaces
    if (myPartyPalaceData?.length) {
      myPartyPalaceData.forEach((palace) => {
        fetchUserBookingData(palace._id);
      });
    }
  }, [myPartyPalaceData]);

  return (
    <section className="w-full p-4 bg-white">
      <div className="flex items-center justify-between">
        <p className="text-2xl font-semibold text-sky-500 uppercase tracking-wide">
          Booking Notifications
        </p>
        {location.pathname.includes("/list") && (
          <span
            onClick={() => navigate(-1)}
            className="size-10 rounded-full bg-sky-500 flex items-center justify-center text-neutral-100 cursor-pointer"
          >
            <IoMdArrowBack size={20} />
          </span>
        )}
      </div>

      <div className="overflow-x-auto max-h-[calc(98vh-64px)] mt-4">
        {location.pathname === "/admin/booking-userstatus" && (
          <div className="flex flex-col gap-4">
            {myPartyPalaceData.length > 0 ? (
              myPartyPalaceData.map((palace, index) => {
                const bookings = userBookingData?.[palace._id] || [];
                const pendingCount = bookings.filter(
                  (b) => b.status === "pending"
                ).length;

                return (
                  <div
                    key={index}
                    className="border border-neutral-300 rounded-md bg-sky-50 even:bg-neutral-50 flex justify-between items-center"
                  >
                    <div className="py-2 px-4">
                      <img
                        src={palace.images[0]}
                        alt={palace.name}
                        className="w-32 h-32 object-cover rounded-md border"
                      />
                    </div>
                    <p className="py-2 px-4 text-xl font-semibold">
                      {palace.name}
                    </p>
                    <p className="py-2 px-4">{palace.location}</p>
                    <p className="py-2 px-4">NPR {palace.pricePerHour}</p>
                    <p className="py-2 px-4">{palace.capacity}</p>
                    <p className="py-2 px-4">{palace.likedBy.length}</p>

                    <div className="py-2 px-4 relative">
                      <button
                        onClick={() =>
                          navigate("/admin/booking-userstatus/list", {
                            state: { partyPalaceId: palace._id },
                          })
                        }
                        className="relative text-green-800 cursor-pointer font-semibold bg-lime-400 px-4 py-1 rounded-md"
                      >
                        View
                        {pendingCount > 0 && (
                          <span className="absolute -top-2 right-0 bg-red-500 text-white size-5 rounded-full p-1 text-xs flex items-center justify-center">
                            {pendingCount}
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-4 text-gray-500">
                No party palaces found.
              </div>
            )}
          </div>
        )}
      </div>

      <Outlet />
    </section>
  );
};

export default NotificationPage;
