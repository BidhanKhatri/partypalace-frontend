import React, { useContext } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { logout } from "../redux/features/userSlice";
import { Link } from "react-router-dom";
import { MdDashboard, MdLogout, MdSettings } from "react-icons/md";
import api from "../utils/apiInstance";
import { ListChecks, VerifiedIcon } from "lucide-react";
import { FaUserSecret } from "react-icons/fa";
import { FaUserGroup, FaUserShield } from "react-icons/fa6";

const SuperAdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  async function handleLogout() {
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
    }
  }

  const navItems = [
    {
      path: "/superadmin/dashboard",
      label: "Dashboard",
      icon: <MdDashboard className="w-5 h-5" />,
      exact: true,
    },
    {
      path: "/superadmin/list-category",
      label: "List Category",
      icon: <ListChecks className="w-5 h-5" />,
      exact: true,
    },
    {
      path: "/superadmin/verify-palaces",
      label: "Verify Palaces",
      icon: <VerifiedIcon className="w-5 h-5" />,
      exact: true,
    },
    {
      path: "/superadmin/list-admins",
      label: "Admin Management",
      icon: <FaUserShield className="w-5 h-5" />,
      exact: true,
    },
    {
      path: "/superadmin/list-users",
      label: "User Management",
      icon: <FaUserGroup className="w-5 h-5" />,
      exact: true,
    },
  ];

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.includes(path.split("/").pop());
  };

  return (
    <aside className="h-screen w-72 bg-white border-r border-gray-200 flex flex-col shadow-sm">
      {/* Logo Section */}
      <div className="px-6 py-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">SuperAdmin Portal</h1>
        <p className="text-xs text-gray-500 mt-1">Management System</p>
      </div>

      {/* Profile Section */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-lg">
            S
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900">
              SuperAdmin Name
            </p>
            <p className="text-xs text-gray-500 truncate">admin@example.com</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-6">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  isActive(item.path, item.exact)
                    ? "bg-blue-50 text-blue-600 border-l-4 border-blue-600"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Bottom Actions */}
      <div className="px-3 py-4 border-t border-gray-200 space-y-2">
        <button
          onClick={() => navigate("/admin/settings")}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 font-medium transition-all duration-200"
        >
          <MdSettings className="w-5 h-5" />
          <span className="text-sm">Settings</span>
        </button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-medium transition-all duration-200"
        >
          <MdLogout className="w-5 h-5" />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default SuperAdminNavbar;
