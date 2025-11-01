import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { setSelectedPartyPalace } from "../redux/features/partypalaceSlice";
import api from "../utils/apiInstance";
import DatePicker from "react-datepicker";
import { setSelectedChat } from "../redux/features/userSlice";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import userContext from "../context/userContext";
import {
  FaHeart,
  FaMapMarkerAlt,
  FaUsers,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
  FaWifi,
  FaUtensils,
  FaMusic,
} from "react-icons/fa";
import Review from "../components/Review";
import MacScrollEffect from "../utils/MacScrollEffect";

const BookingPage = () => {
  const { partypalace, selectedPartyPalace } = useSelector(
    (state) => state?.partypalace
  );
  const { token } = useSelector((state) => state?.user);
  const { getBookingData } = useContext(userContext);
  const dispatch = useDispatch();
  const { id } = useParams();
  const [imageIndex, setImageIndex] = useState(0);
  const [startDate, setStartDate] = useState(null);
  const [hoursBooked, setHoursBooked] = useState(1);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const scrollTopRef = useRef(null);

  useEffect(() => {
    fetchOnlyOne();
  }, []);

  const handleImgIndex = (index) => {
    setImageIndex(index);
  };

  const fetchOnlyOne = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/api/partypalace/get-one/${id}`);
      if (res && res.data.success) {
        dispatch(setSelectedPartyPalace(res.data.data));
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load party palace details");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-900 via-neutral-950 to-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-20 h-20">
            <div className="absolute inset-0 rounded-full border-4 border-neutral-700"></div>
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#FBAD34] animate-spin"></div>
          </div>
          <div className="space-y-2 text-center">
            <p className="text-gray-400 text-sm font-medium">
              Loading party palace details
            </p>
            <div className="flex gap-1 justify-center">
              <div
                className="w-2 h-2 bg-[#FBAD34] rounded-full animate-bounce"
                style={{ animationDelay: "0s" }}
              ></div>
              <div
                className="w-2 h-2 bg-[#FBAD34] rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-[#FBAD34] rounded-full animate-bounce"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedPartyPalace) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-neutral-900 via-neutral-950 to-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-400 text-lg">Party palace not found</p>
        </div>
      </div>
    );
  }

  const payload = {
    partyPalaceId: selectedPartyPalace._id,
    bookingDate: startDate,
    hoursBooked: hoursBooked,
    totalPrice: selectedPartyPalace.pricePerHour * hoursBooked,
  };

  const handleBooking = async () => {
    try {
      setIsBooking(true);
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await api.post("/api/booking/create", payload, config);
      if (res && res.data.success) {
        toast.success(res.data.msg);
        getBookingData();
        setStartDate(null);
        setHoursBooked(1);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
    } finally {
      setIsBooking(false);
    }
  };

  const dispatchSelectedPartyPalace = () => {
    const payload = {
      partyPalaceName: selectedPartyPalace.name,
      userId: selectedPartyPalace.createdBy._id,
      userName: selectedPartyPalace.createdBy.username,
    };
    dispatch(setSelectedChat(payload));
    localStorage.setItem("selectedChat", JSON.stringify(payload));
  };

  const nextImage = () => {
    setImageIndex((prevIndex) =>
      prevIndex === selectedPartyPalace.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setImageIndex((prevIndex) =>
      prevIndex === 0 ? selectedPartyPalace.images.length - 1 : prevIndex - 1
    );
  };

  const toggleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Removed from favorites" : "Added to favorites");
  };

  return (
    <MacScrollEffect>
      <section className="mt-6 md:mt-14 max-w-7xl mx-auto px-3 sm:px-6 min-h-[calc(100vh-64px)] bg-gradient-to-b from-neutral-900 via-neutral-950 to-black text-white rounded-xl md:rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-10 flex-1 overflow-hidden">
          {/* Left Section: Image Gallery */}
          <div className="space-y-3 md:space-y-4 flex flex-col mt-8 justify-center lg:justify-normal bg-neutral-900/70 backdrop-blur-sm p-3 md:p-4 rounded-lg md:rounded-2xl shadow-lg overflow-hidden">
            <div className="relative h-64 sm:h-80 md:h-96 lg:h-[450px] rounded-lg md:rounded-xl overflow-hidden shadow-lg group">
              <img
                src={
                  selectedPartyPalace.images[imageIndex] || "/placeholder.svg"
                }
                alt={selectedPartyPalace.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <button
                onClick={prevImage}
                className="absolute left-2 md:left-3 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1.5 md:p-2 rounded-full transition z-10"
              >
                <FaChevronLeft className="text-sm md:text-base" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 md:right-3 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-1.5 md:p-2 rounded-full transition z-10"
              >
                <FaChevronRight className="text-sm md:text-base" />
              </button>
              <div className="absolute bottom-2 md:bottom-3 left-1/2 transform -translate-x-1/2 flex gap-1 bg-black/50 px-3 py-1.5 rounded-full backdrop-blur-sm">
                {selectedPartyPalace.images.map((_, index) => (
                  <div
                    key={index}
                    className={`h-1.5 w-1.5 rounded-full transition-all ${
                      imageIndex === index ? "bg-[#FBAD34] w-4" : "bg-gray-400"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="flex gap-2 md:gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#FBAD34]/70 scrollbar-track-neutral-800 rounded-lg">
              {selectedPartyPalace.images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => handleImgIndex(index)}
                  className={`h-16 md:h-20 w-20 md:w-24 flex-shrink-0 cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-300 ${
                    imageIndex === index
                      ? "border-[#FBAD34] shadow-md ring-2 ring-[#FBAD34]/50"
                      : "border-neutral-700 hover:border-[#FBAD34]"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Preview ${index}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Right Section: Booking Details */}
          <div className="space-y-4 md:space-y-6 bg-neutral-900/70 backdrop-blur-sm p-3 md:p-6 rounded-lg md:rounded-2xl shadow-lg overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent max-h-screen lg:max-h-none">
            <div>
              <div className="flex justify-between items-start md:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white truncate">
                    {selectedPartyPalace.name}
                  </h1>
                  <p className="text-xs md:text-sm text-gray-400 mt-1">
                    By {selectedPartyPalace.createdBy.username}
                  </p>
                </div>
                <button
                  onClick={toggleLike}
                  className={`flex-shrink-0 text-xl md:text-2xl transition-all ${
                    isLiked
                      ? "text-red-500 scale-110"
                      : "text-gray-400 hover:text-red-500"
                  }`}
                >
                  <FaHeart />
                </button>
              </div>
              <p className="mt-3 md:mt-4 text-xs sm:text-sm md:text-base text-gray-300 leading-relaxed">
                {selectedPartyPalace.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
              <div className="flex items-center space-x-2 md:space-x-3 text-gray-300 bg-neutral-800/50 p-3 rounded-lg">
                <FaMapMarkerAlt className="text-[#FBAD34] flex-shrink-0" />
                <span className="truncate">{selectedPartyPalace.location}</span>
              </div>
              <div className="flex items-center space-x-2 md:space-x-3 text-gray-300 bg-neutral-800/50 p-3 rounded-lg">
                <FaUsers className="text-[#FBAD34] flex-shrink-0" />
                <span>Capacity: {selectedPartyPalace.capacity}</span>
              </div>
              <div className="flex items-center space-x-2 md:space-x-3 text-gray-300 bg-neutral-800/50 p-3 rounded-lg">
                <FaClock className="text-[#FBAD34] flex-shrink-0" />
                <span>NPR {selectedPartyPalace.pricePerHour} / hour</span>
              </div>
              <div className="flex items-center space-x-2 md:space-x-3 text-gray-300 bg-neutral-800/50 p-3 rounded-lg">
                <FaWifi className="text-[#FBAD34] flex-shrink-0" />
                <span>Premium Service</span>
              </div>
            </div>

            <div className="bg-neutral-800/70 p-3 md:p-6 rounded-lg shadow-inner border border-neutral-700">
              <h2 className="text-lg md:text-xl font-semibold mb-4 text-white">
                Book Your Event
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-300 mb-2">
                    Select Date
                  </label>
                  <DatePicker
                    inline
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    minDate={new Date()}
                    className="w-full p-2 bg-neutral-900 border border-neutral-700 text-white rounded-md focus:ring-[#FBAD34] focus:border-[#FBAD34] text-xs md:text-sm"
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="hoursBooked"
                    className="block text-xs md:text-sm font-medium text-gray-300 mb-2"
                  >
                    Booking Hours
                  </label>
                  <input
                    id="hoursBooked"
                    type="number"
                    className="w-full p-2 md:p-3 bg-neutral-900 border border-neutral-700 text-white rounded-md focus:ring-[#FBAD34] focus:border-[#FBAD34] text-sm md:text-base"
                    value={hoursBooked}
                    min="1"
                    max="12"
                    onChange={(e) =>
                      setHoursBooked(
                        Math.max(
                          1,
                          Math.min(12, Number.parseInt(e.target.value) || 1)
                        )
                      )
                    }
                  />
                  <div className="mt-4 bg-neutral-900 p-3 md:p-4 rounded-md shadow-sm text-xs md:text-sm space-y-2 border border-neutral-800">
                    <p className="flex justify-between py-1.5 text-gray-300">
                      <span>Selected Date:</span>
                      <span className="font-semibold text-white text-right">
                        {startDate
                          ? startDate.toLocaleDateString()
                          : "Not selected"}
                      </span>
                    </p>
                    <p className="flex justify-between py-1.5 text-gray-300">
                      <span>Total Hours:</span>
                      <span className="font-semibold text-white">
                        {hoursBooked} hours
                      </span>
                    </p>
                    <div className="h-px bg-neutral-700 my-2"></div>
                    <p className="flex justify-between py-1.5 text-base md:text-lg font-bold text-[#FBAD34]">
                      <span>Total Price:</span>
                      <span>
                        NPR {selectedPartyPalace.pricePerHour * hoursBooked}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleBooking}
                disabled={!startDate || isBooking}
                className={`w-full sm:flex-1 py-2.5 md:py-3 rounded-lg text-white font-medium text-sm md:text-base transition-all duration-200 ${
                  startDate && !isBooking
                    ? "bg-[#FBAD34] hover:bg-[#e99d23] hover:scale-[1.02] active:scale-95"
                    : "bg-neutral-700 cursor-not-allowed opacity-50"
                } flex items-center justify-center gap-2`}
              >
                {isBooking ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Booking...</span>
                  </>
                ) : (
                  "Book Now"
                )}
              </button>
              <Link
                to={`/chat/${selectedPartyPalace.createdBy._id}/${selectedPartyPalace._id}`}
                onClick={dispatchSelectedPartyPalace}
                className="w-full sm:flex-1 text-center py-2.5 md:py-3 bg-lime-500 text-white rounded-lg font-medium text-sm md:text-base hover:bg-lime-600 hover:scale-[1.02] transition-all duration-200 active:scale-95"
              >
                Chat with Host
              </Link>
            </div>
          </div>
        </div>

        {/* Location and Reviews */}
        <div className="mt-6 md:mt-10">
          <h3 className="text-base md:text-lg font-semibold mb-3 md:mb-4 text-white px-3 md:px-0">
            📍 Location
          </h3>
          <div className="rounded-lg md:rounded-xl overflow-hidden shadow-md border border-neutral-800 bg-neutral-600 h-64 sm:h-80 md:h-96">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3531.2148396731245!2d85.33767297485124!3d27.741518776162994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb194f5011d8d7%3A0x949bc3536d79803!2sAustralian%20Embassy!5e0!3m2!1sen!2snp!4v1739001392095!5m2!1sen!2snp"
              width="100%"
              height="100%"
              style={{ border: 0, backgroundColor: "black" }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>

        <div className="mt-6 md:mt-10">
          <Review />
        </div>
      </section>
    </MacScrollEffect>
  );
};

export default BookingPage;
