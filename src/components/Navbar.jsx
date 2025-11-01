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

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBookOpen, setIsBookOpen] = useState(false);
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
  };
  const toggleBookMenu = () => {
    setIsBookOpen(!isBookOpen);
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
      } fixed w-full top-0 left-0 z-30 py-3 lg:py-2 backdrop-blur-md transition-all duration-300`}
      id="navbar"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center">
          <div className="flex space-x-8 items-center">
            <a href="/" className="w-32 h-8 relative flex-shrink-0">
              <img
                alt="Logo"
                className="object-cover h-8 w-32 text-xl font-bold cursor-pointer"
              />
            </a>

            <div className="hidden lg:flex items-center space-x-1">
              <Link
                to={"/"}
                className="py-3 px-3 text-sm font-medium hover:text-orange-400 transition duration-300 cursor-pointer flex items-center gap-2 text-slate-300"
              >
                <FaHome className="text-sm" />
                Home
              </Link>

              <Link
                to={"/cameraman"}
                className="py-3 px-3 text-sm font-medium hover:text-orange-400 transition duration-300 cursor-pointer flex items-center gap-2 text-slate-300"
              >
                <FaCamera className="text-sm" />
                CameraMan
              </Link>
              <a className="py-3 px-3 text-sm font-medium hover:text-orange-400 transition duration-300 cursor-pointer flex items-center gap-2 text-slate-300">
                <FaPhoneVolume className="text-sm" />
                Contact
              </a>

              <a className="py-3 px-3 text-sm font-medium hover:text-orange-400 transition duration-300 cursor-pointer flex items-center gap-2 text-slate-300">
                <FaStar className="text-sm" />
                Reviews
              </a>

              <div className="cursor-pointer flex items-center gap-2 group">
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
            </div>
          </div>

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

          <div className="lg:hidden flex items-center">
            <button className="outline-none" onClick={toggleMenu}>
              {isOpen ? (
                <X className="w-6 h-6 text-slate-300" />
              ) : (
                <Menu className="w-6 h-6 text-slate-300" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`lg:hidden ${
          isOpen ? "block" : "hidden"
        } bg-slate-800/50 border-t border-slate-700/30 divide-y divide-slate-700`}
      >
        <Link
          to={"/"}
          className="py-3 px-6 text-sm font-medium hover:bg-slate-700/50 hover:text-orange-400 flex items-center gap-3 text-slate-300 transition-all"
        >
          <FaHome className="text-sm" /> Home
        </Link>
        <Link
          to={"/cameraman"}
          className="py-3 px-6 text-sm font-medium hover:bg-slate-700/50 hover:text-orange-400 flex items-center gap-3 text-slate-300 transition-all"
        >
          <FaCamera className="text-sm" /> CameraMan
        </Link>
        <a className="py-3 px-6 text-sm font-medium hover:bg-slate-700/50 hover:text-orange-400 flex items-center gap-3 text-slate-300 transition-all">
          <FaPhoneVolume className="text-sm" /> Contact
        </a>
        <a className="py-3 px-6 text-sm font-medium hover:bg-slate-700/50 hover:text-orange-400 flex items-center gap-3 text-slate-300 transition-all">
          <FaStar className="text-sm" /> Reviews
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
