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
  const scrollTopRef = useRef(null);
  console.log("selectedPartyPalace ", selectedPartyPalace);

  useEffect(() => {
    fetchOnlyOne();
  }, []);

  const handleImgIndex = (index) => {
    setImageIndex(index);
  };

  const fetchOnlyOne = async () => {
    try {
      const res = await api.get(`/api/partypalace/get-one/${id}`);
      if (res && res.data.success) {
        dispatch(setSelectedPartyPalace(res.data.data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  if (!selectedPartyPalace) {
    return <div className="text-center mt-10 text-gray-500">Loading...</div>;
  }

  const payload = {
    partyPalaceId: selectedPartyPalace._id,
    bookingDate: startDate,
    hoursBooked: hoursBooked,
    totalPrice: selectedPartyPalace.pricePerHour * hoursBooked,
  };

  const handleBooking = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const res = await api.post(
        "/api/booking/create",
        payload,
        config
      );
      if (res && res.data.success) {
        toast.success(res.data.msg);
        getBookingData();
        setStartDate(null);
        setHoursBooked(1);
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.msg);
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

  if (!selectedPartyPalace) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-[#FBAD34]"></div>
      </div>
    );
  }

  const toggleLike = () => {
    setIsLiked(!isLiked);
    // Here you would typically make an API call to update the like status
    toast.success(isLiked ? "Removed from favorites" : "Added to favorites");
  };

  return (
    <MacScrollEffect>
      <section className="mt-14 max-w-7xl mx-auto px-6 min-h-[calc(100vh-64px)] bg-gradient-to-b from-neutral-900 via-neutral-950 to-black text-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
        <div className="grid lg:grid-cols-2 gap-10 flex-1 overflow-hidden">
          {/* Left Section: Image Gallery */}
          <div className="space-y-4 flex flex-col justify-center bg-neutral-900/70 backdrop-blur-sm p-4 rounded-2xl shadow-lg overflow-hidden">
            <div className="relative h-[450px] rounded-xl overflow-hidden shadow-lg">
              <img
                src={
                  selectedPartyPalace.images[imageIndex] || "/placeholder.svg"
                }
                alt={selectedPartyPalace.name}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
              <button
                onClick={prevImage}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition"
              >
                <FaChevronLeft />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition"
              >
                <FaChevronRight />
              </button>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-[#FBAD34]/70 scrollbar-track-neutral-800 rounded-lg">
              {selectedPartyPalace.images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => handleImgIndex(index)}
                  className={`h-20 w-24 flex-shrink-0 cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-300 ${
                    imageIndex === index
                      ? "border-[#FBAD34] shadow-md"
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
          <div className="space-y-6 bg-neutral-900/70 backdrop-blur-sm p-6 rounded-2xl shadow-lg overflow-y-auto scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent">
            <div>
              <div className="flex justify-between items-center">
                <h1 className="text-3xl lg:text-4xl font-bold text-white">
                  {selectedPartyPalace.name}
                </h1>
                <button
                  onClick={toggleLike}
                  className={`text-2xl transition-all ${
                    isLiked
                      ? "text-red-500 scale-110"
                      : "text-gray-400 hover:text-red-500"
                  }`}
                >
                  <FaHeart />
                </button>
              </div>
              <p className="mt-2 text-gray-400 leading-relaxed">
                {selectedPartyPalace.description}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center space-x-2 text-gray-300">
                <FaMapMarkerAlt className="text-[#FBAD34]" />
                <span>{selectedPartyPalace.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <FaUsers className="text-[#FBAD34]" />
                <span>Capacity: {selectedPartyPalace.capacity}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-300">
                <FaClock className="text-[#FBAD34]" />
                <span>NPR {selectedPartyPalace.pricePerHour} / hour</span>
              </div>
            </div>

            <div className="bg-neutral-800/70 p-6 rounded-lg shadow-inner border border-neutral-700">
              <h2 className="text-xl font-semibold mb-4 text-white">
                Book Your Event
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Select Date
                  </label>
                  <DatePicker
                    inline
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    minDate={new Date()}
                    className="w-full p-2 bg-neutral-900 border border-neutral-700 text-white rounded-md focus:ring-[#FBAD34] focus:border-[#FBAD34]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="hoursBooked"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Booking Hours
                  </label>
                  <input
                    id="hoursBooked"
                    type="number"
                    className="w-full p-2 bg-neutral-900 border border-neutral-700 text-white rounded-md focus:ring-[#FBAD34] focus:border-[#FBAD34]"
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
                  <div className="mt-4 bg-neutral-900 p-4 rounded-md shadow-sm text-sm space-y-2 border border-neutral-800">
                    <p className="flex justify-between py-1 text-gray-300">
                      <span>Selected Date:</span>
                      <span className="font-semibold text-white">
                        {startDate
                          ? startDate.toLocaleDateString()
                          : "Not selected"}
                      </span>
                    </p>
                    <p className="flex justify-between py-1 text-gray-300">
                      <span>Total Hours:</span>
                      <span className="font-semibold text-white">
                        {hoursBooked} hours
                      </span>
                    </p>
                    <p className="flex justify-between py-1 text-lg font-bold text-[#FBAD34]">
                      <span>Total Price:</span>
                      <span>
                        NPR {selectedPartyPalace.pricePerHour * hoursBooked}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleBooking}
                disabled={!startDate}
                className={`flex-1 py-3 rounded-lg text-white font-medium transition-transform ${
                  startDate
                    ? "bg-[#FBAD34] hover:bg-[#e99d23] hover:scale-[1.03]"
                    : "bg-neutral-700 cursor-not-allowed"
                }`}
              >
                Book Now
              </button>
              <Link
                to={`/chat/${selectedPartyPalace.createdBy._id}/${selectedPartyPalace._id}`}
                onClick={dispatchSelectedPartyPalace}
                className="flex-1 text-center py-3 bg-lime-500 text-white rounded-lg font-medium hover:bg-lime-600 hover:scale-[1.03] transition-transform"
              >
                Chat with Host
              </Link>
            </div>
          </div>
        </div>

        {/* Location and Reviews */}
        <div className="mt-10">
          <h3 className="text-lg font-semibold mb-2 text-white">Location</h3>
          <div className="rounded-lg overflow-hidden shadow-md border border-neutral-800 bg-neutral-600">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3531.2148396731245!2d85.33767297485124!3d27.741518776162994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb194f5011d8d7%3A0x949bc3536d79803!2sAustralian%20Embassy!5e0!3m2!1sen!2snp!4v1739001392095!5m2!1sen!2snp"
              width="100%"
              height="250"
              style={{ border: 0, backgroundColor: "black" }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </div>

        <div className="mt-6">
          <Review />
        </div>
      </section>
    </MacScrollEffect>
  );
};

export default BookingPage;
