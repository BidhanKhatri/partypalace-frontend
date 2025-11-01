import { useState, useRef, useEffect } from "react";
import { FaArrowLeft, FaUser } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import Banner1 from "../assets/images/user.jpeg";
import api from "../utils/apiInstance";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { logout } from "../redux/features/userSlice";

const ProfileDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const res = await api.get("/api/user/logout");

      if (res && res.data.success) {
        toast.success(res.data.msg);
        dispatch(logout());
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.msg);
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-9 h-9 rounded-full border border-slate-600 overflow-hidden cursor-pointer"
      >
        <img
          src={Banner1}
          alt="Profile"
          className="w-full h-full object-cover"
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="min-w-56 bg-slate-800 rounded-lg absolute top-11 -right-4 p-2 border border-slate-700 z-50">
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded"
          >
            <FaUser /> Profile
          </Link>
          <Link
            to="/setting"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded"
          >
            <IoMdSettings /> Setting
          </Link>
          <button
            onClick={handleLogout}
            className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 rounded"
          >
            <FaArrowLeft /> Logout
          </button>
        </div>
      )}
    </div>
  );
};
export default ProfileDropdown;
