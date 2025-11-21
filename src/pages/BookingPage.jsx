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

// Import Swiper React components and styles
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Thumbs, Autoplay, A11y } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";

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
  const [eventType, setEventType] = useState("");
  const [guestCount, setGuestCount] = useState("");
  const [packageType, setPackageType] = useState("");
  const [specialRequirements, setSpecialRequirements] = useState("");
  const [advancePaid, setAdvancePaid] = useState("");
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

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

  // Fix date formatting to handle timezone issues
  const formatDateForPayload = (date) => {
    if (!date) return null;

    // Use local date components to avoid timezone issues
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
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
    bookingDate: formatDateForPayload(startDate), // Use fixed date formatting
    eventType,
    guestCount: Number(guestCount),
    package: packageType,
    specialRequirements,
    advancePaid: Number(advancePaid),
    totalPrice: selectedPartyPalace.pricePerHour * hoursBooked,
  };

  console.log(payload);

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
        setEventType("");
        setGuestCount("");
        setPackageType("");
        setSpecialRequirements("");
        setAdvancePaid("");
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

  const toggleLike = () => {
    setIsLiked(!isLiked);
    toast.success(isLiked ? "Removed from favorites" : "Added to favorites");
  };

  return (
    <MacScrollEffect>
      <section className="mt-6 md:mt-14 max-w-7xl mx-auto px-3 sm:px-6 min-h-[calc(100vh-64px)] bg-gradient-to-b from-neutral-900 via-neutral-950 to-black text-white rounded-xl md:rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-10 flex-1 overflow-hidden">
          {/* Left Section: Image Gallery with Swiper */}
          <div className="space-y-3 md:space-y-4 flex flex-col mt-8 justify-center lg:justify-normal bg-neutral-900/70 backdrop-blur-sm p-3 md:p-4 rounded-lg md:rounded-2xl shadow-lg overflow-hidden">
            {/* Main Swiper */}
            <div className="relative h-64 sm:h-80 md:h-96 lg:h-[450px] rounded-lg md:rounded-xl overflow-hidden shadow-lg">
              <Swiper
                modules={[Navigation, Pagination, Thumbs, Autoplay, A11y]}
                navigation
                autoplay={{ delay: 2000, disableOnInteraction: false }}
                loop={true}
                pagination={{
                  clickable: true,
                }}
                className="h-full w-full"
                onSlideChange={(swiper) => setImageIndex(swiper.activeIndex)}
              >
                {selectedPartyPalace.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`${selectedPartyPalace.name} - Image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Thumbnail Swiper */}
            <div className="w-full">
              <Swiper
                modules={[Thumbs]}
                watchSlidesProgress
                onSwiper={setThumbsSwiper}
                spaceBetween={8}
                slidesPerView={4}
                freeMode={true}
                className="thumbnail-swiper"
              >
                {selectedPartyPalace.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <div
                      className={`h-16 md:h-20 w-full cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-300 ${
                        imageIndex === index
                          ? "border-[#FBAD34] shadow-md ring-2 ring-[#FBAD34]/50"
                          : "border-neutral-700 hover:border-[#FBAD34]"
                      }`}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* Right Section: Booking Details */}
          <div className="space-y-4 md:space-y-6 bg-neutral-900/70 backdrop-blur-sm p-3 md:p-6 rounded-lg md:rounded-2xl shadow-lg overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent max-h-screen lg:max-h-none">
            <div>
              <div className="flex justify-between items-start md:items-center gap-3">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white truncate py-1.5">
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
                <span>NPR {selectedPartyPalace.pricePerHour} / day</span>
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
                  <label className="block text-xs md:text-sm font-medium text-gray-300 mb-2">
                    Event Type *
                  </label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value)}
                    className="p-2 md:p-3 bg-neutral-900 border border-neutral-700 text-white rounded-md"
                  >
                    <option value="">Select event</option>
                    <option value="wedding">Wedding</option>
                    <option value="birthday">Birthday</option>
                    <option value="reception">Reception</option>
                    <option value="corporate">Corporate Event</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="block text-xs md:text-sm font-medium text-gray-300 mb-2">
                    Guest Count *
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={guestCount}
                    onChange={(e) => setGuestCount(e.target.value)}
                    className="p-2 md:p-3 bg-neutral-900 border border-neutral-700 text-white rounded-md"
                    placeholder="Number of guests"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="block text-xs md:text-sm font-medium text-gray-300 mb-2">
                    Package *
                  </label>
                  <select
                    value={packageType}
                    onChange={(e) => setPackageType(e.target.value)}
                    className="p-2 md:p-3 bg-neutral-900 border border-neutral-700 text-white rounded-md"
                  >
                    <option value="">Select package</option>
                    <option value="silver">Silver</option>
                    <option value="gold">Gold</option>
                    <option value="platinum">Platinum</option>
                  </select>
                </div>

                <div className="flex flex-col md:col-span-2">
                  <label className="block text-xs md:text-sm font-medium text-gray-300 mb-2">
                    Special Requirements
                  </label>
                  <textarea
                    rows={3}
                    value={specialRequirements}
                    onChange={(e) => setSpecialRequirements(e.target.value)}
                    className="p-2 md:p-3 bg-neutral-900 border border-neutral-700 text-white rounded-md"
                    placeholder="Decoration, catering, sound system, etc."
                  />
                </div>

                <div className="flex flex-col md:col-span-2">
                  <label className="block text-xs md:text-sm font-medium text-gray-300 mb-2">
                    Advance Payment
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={advancePaid}
                    onChange={(e) => setAdvancePaid(e.target.value)}
                    className="p-2 md:p-3 bg-neutral-900 border border-neutral-700 text-white rounded-md"
                    placeholder="Amount paid in advance (optional)"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleBooking}
                disabled={
                  !startDate ||
                  !eventType ||
                  !guestCount ||
                  !packageType ||
                  isBooking
                }
                className={`w-full sm:flex-1 py-2.5 md:py-3 rounded-lg text-white font-medium text-sm md:text-base transition-all duration-200 flex items-center justify-center gap-2
    ${
      !startDate || !eventType || !guestCount || !packageType || isBooking
        ? "bg-neutral-700 cursor-not-allowed opacity-50"
        : "bg-[#FBAD34] hover:bg-[#e99d23] hover:scale-[1.02] active:scale-95"
    }
  `}
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
