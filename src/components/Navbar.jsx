import { useContext, useEffect, useMemo, useState } from "react";
import {
  FaBook,
  FaCamera,
  FaFacebook,
  FaHome,
  FaInstagram,
  FaPhoneVolume,
  FaSearch,
  FaStar,
  FaWhatsapp,
} from "react-icons/fa";
import { Menu, X } from "lucide-react";
import { IoMdSettings } from "react-icons/io";
import { IoLocationSharp } from "react-icons/io5";
import {
  FaArrowLeft,
  FaBookBookmark,
  FaLocationPin,
  FaMapLocation,
  FaScrewdriver,
  FaScrewdriverWrench,
  FaUser,
} from "react-icons/fa6";
import Banner1 from "../assets/images/banner1.jpg";
import { TypeAnimation } from "react-type-animation";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../redux/features/userSlice";
import { useDispatch, useSelector } from "react-redux";
import ShowBooking from "./ShowBooking";
import userContext from "../context/userContext";
import SearchBar from "./SearchBar";
import ProfileDropdown from "./ProfileDropdown";

const PartyPalaceLogo = () => (
  <svg
    width="140"
    height="32"
    viewBox="0 0 140 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="h-8 w-auto"
  >
    {/* Party Palace Text with decorative elements */}
    <defs>
      <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style={{ stopColor: "#fb923c", stopOpacity: 1 }} />
        <stop offset="100%" style={{ stopColor: "#ea580c", stopOpacity: 1 }} />
      </linearGradient>
    </defs>

    {/* Balloons */}
    <circle cx="8" cy="8" r="2.5" fill="url(#logoGradient)" />
    <circle cx="132" cy="10" r="2.5" fill="url(#logoGradient)" />
    <circle cx="135" cy="22" r="2" fill="#f97316" opacity="0.7" />

    {/* Party hat */}
    <path d="M 4 18 L 6 10 L 8 18 Z" fill="url(#logoGradient)" />

    {/* Text */}
    <text
      x="16"
      y="22"
      fontFamily="Arial, sans-serif"
      fontSize="14"
      fontWeight="bold"
      fill="url(#logoGradient)"
      stroke="#ea580c"
      strokeWidth="0.5"
      letterSpacing="0.5"
    >
      PARTY PALACE
    </text>

    {/* Decorative line */}
    <line
      x1="16"
      y1="26"
      x2="130"
      y2="26"
      stroke="url(#logoGradient)"
      strokeWidth="1"
    />
  </svg>
);

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBookOpen, setIsBookOpen] = useState(false);
  const [showSearchMobile, setShowSearchMobile] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const bookedPartyPalaceLength = useSelector(
    (state) => state.partypalace.bookedPartyPalaceLength
  );

  const { bookingData, getBookingData } = useContext(userContext);

  const searchComponent = useMemo(() => <SearchBar />, []);

  useEffect(() => {
    getBookingData();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    setShowSearchMobile(false);
  };

  const toggleBookMenu = () => {
    setIsBookOpen(!isBookOpen);
  };

  const toggleSearchMobile = () => {
    setShowSearchMobile(!showSearchMobile);
  };

  let prevY = window.scrollY;
  function handleNavbarColor() {
    let curY = window.scrollY;
    const navEl = document.querySelector("#navbar");

    if (curY > prevY) {
      if (window.scrollY >= 80) {
        navEl.style.marginTop = "-80px";
        navEl.style.transition = "margin-top 0.3s ease-in-out";
      }
    } else {
      navEl.style.marginTop = "0px";
    }
    return (prevY = curY);
  }

  useEffect(() => {
    window.addEventListener("scroll", handleNavbarColor);

    return () => window.removeEventListener("scroll", handleNavbarColor);
  }, []);

  return (
    <nav
      className={`${
        location.pathname === "/"
          ? "bg-gradient-to-b from-slate-950/95 to-slate-900/90 text-slate-200 border-b border-slate-700/30"
          : "bg-gradient-to-b from-slate-950 to-slate-900 shadow-lg text-slate-200 border-b border-slate-700/30"
      } fixed w-full top-0 left-0 z-30 py-2 lg:py-2 backdrop-blur-md transition-all duration-300`}
      id="navbar"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center flex-shrink-0">
            <Link
              to="/"
              className="flex items-center hover:opacity-80 transition-opacity"
            >
              <PartyPalaceLogo />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <Link
              to={"/"}
              className="py-3 px-3 text-sm font-medium hover:text-orange-400 transition duration-300 cursor-pointer flex items-center gap-2 text-slate-300"
            >
              <FaHome className="text-sm" />
              Home
            </Link>

            {/* <Link
              to={"/cameraman"}
              className="py-3 px-3 text-sm font-medium hover:text-orange-400 transition duration-300 cursor-pointer flex items-center gap-2 text-slate-300"
            >
              <FaCamera className="text-sm" />
              CameraMan
            </Link> */}
            <Link
              to={"/map"}
              className="py-3 px-3 text-sm font-medium hover:text-orange-400 transition duration-300 cursor-pointer flex items-center gap-2 text-slate-300"
            >
              <FaLocationPin className="text-sm" />
              Open Map
            </Link>
            <a className="py-3 px-3 text-sm font-medium hover:text-orange-400 transition duration-300 cursor-pointer flex items-center gap-2 text-slate-300">
              <FaPhoneVolume className="text-sm" />
              Contact
            </a>

            <Link
              to="/feedback"
              className="py-3 px-3 text-sm font-medium hover:text-orange-400 transition duration-300 cursor-pointer flex items-center gap-2 text-slate-300"
            >
              <FaStar className="text-sm" />
              Feedbacks
            </Link>
          </div>

          {/* Desktop Search */}
          <div className="hidden lg:flex cursor-pointer items-center group">
            {location.pathname.includes("/search") ? (
              searchComponent
            ) : (
              <div
                onClick={() => navigate("/search")}
                className="w-64 flex items-center gap-3 border border-slate-600/50 bg-slate-800/40 hover:bg-slate-800/60 p-2.5 rounded-lg group-focus-within:border-orange-400 transition-all duration-300"
              >
                <FaSearch className="text-slate-400 group-focus-within:text-orange-400 text-sm" />
                <TypeAnimation
                  sequence={[
                    "Search Party Palaces Here",
                    1000,
                    "Search Venues Here",
                    1000,
                    "Search Restaurants Here",
                    1000,
                    "Search Venues and Restaurants",
                    1000,
                  ]}
                  wrapper="span"
                  speed={50}
                  style={{ fontSize: "0.75rem", display: "inline-block" }}
                  repeat={Infinity}
                  className="text-slate-400"
                />
              </div>
            )}
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center space-x-6">
            <span onClick={toggleBookMenu} className="relative cursor-pointer">
              {bookedPartyPalaceLength > 0 ? (
                <span className="size-5 rounded-full absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-xs text-white flex items-center justify-center font-semibold">
                  {bookedPartyPalaceLength}
                </span>
              ) : (
                ""
              )}

              <FaBookBookmark
                size={20}
                className="text-slate-300 hover:text-orange-400 transition-colors"
              />
            </span>

            {isBookOpen && (
              <ShowBooking close={toggleBookMenu} isBookOpen={isBookOpen} />
            )}
            <ProfileDropdown />
          </div>

          {/* Mobile/Tablet Right Section */}
          <div className="lg:hidden flex items-center space-x-4">
            {/* Mobile Booking */}
            <span onClick={toggleBookMenu} className="relative cursor-pointer">
              {bookedPartyPalaceLength > 0 ? (
                <span className="size-5 rounded-full absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 bg-orange-500 text-xs text-white flex items-center justify-center font-semibold">
                  {bookedPartyPalaceLength}
                </span>
              ) : (
                ""
              )}

              <FaBookBookmark
                size={18}
                className="text-slate-300 hover:text-orange-400 transition-colors"
              />
            </span>

            {isBookOpen && (
              <ShowBooking close={toggleBookMenu} isBookOpen={isBookOpen} />
            )}

            {/* Mobile Menu Button */}
            <button className="outline-none" onClick={toggleMenu}>
              {isOpen ? (
                <X className="w-6 h-6 text-slate-300" />
              ) : (
                <Menu className="w-6 h-6 text-slate-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div
          className={`lg:hidden mt-3 transition-all duration-300 ${
            isOpen ? "block" : "hidden"
          }`}
        >
          {location.pathname.includes("/search") ? (
            searchComponent
          ) : (
            <div
              onClick={() => {
                navigate("/search");
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 border border-slate-600/50 bg-slate-800/40 hover:bg-slate-800/60 p-2.5 rounded-lg transition-all duration-300 cursor-pointer"
            >
              <FaSearch className="text-slate-400 text-sm flex-shrink-0" />
              <TypeAnimation
                sequence={[
                  "Search Party Palaces",
                  1000,
                  "Search Venues",
                  1000,
                  "Search Restaurants",
                  1000,
                ]}
                wrapper="span"
                speed={50}
                style={{ fontSize: "0.75rem", display: "inline-block" }}
                repeat={Infinity}
                className="text-slate-400"
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden ${
          isOpen ? "block" : "hidden"
        } bg-slate-800/50 border-t border-slate-700/30 divide-y divide-slate-700 mt-2`}
      >
        <Link
          to={"/"}
          onClick={() => setIsOpen(false)}
          className="py-3 px-6 text-sm font-medium hover:bg-slate-700/50 hover:text-orange-400 flex items-center gap-3 text-slate-300 transition-all"
        >
          <FaHome className="text-sm" /> Home
        </Link>
        <Link
          to={"/map"}
          onClick={() => setIsOpen(false)}
          className="py-3 px-6 text-sm font-medium hover:bg-slate-700/50 hover:text-orange-400 flex items-center gap-3 text-slate-300 transition-all"
        >
          <FaLocationPin className="text-sm" />
          Open Map
        </Link>

        <a className="py-3 px-6 text-sm font-medium hover:bg-slate-700/50 hover:text-orange-400 flex items-center gap-3 text-slate-300 transition-all cursor-pointer">
          <FaPhoneVolume className="text-sm" /> Contact
        </a>
        <Link
          to="/feedback"
          className="py-3 px-6 text-sm font-medium hover:bg-slate-700/50 hover:text-orange-400 flex items-center gap-3 text-slate-300 transition-all cursor-pointer"
        >
          <FaStar className="text-sm" /> Feedbacks
        </Link>
        <div className="lg:hidden py-3 px-6">
          <ProfileDropdown />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
