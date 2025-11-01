import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  const location = useLocation();
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Subscribed with email: ${email}`);
    setEmail("");
  };

  // Hide footer on certain pages (like chat)
  if (location.pathname.includes("/chat")) return null;

  return (
    <footer
      className={`relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-t border-slate-800 ${
        location.pathname === "/search" ? "hidden" : ""
      }`}
    >
      {/* Orange glow accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-orange-600/20 via-orange-500/10 to-transparent rounded-full blur-3xl"></div>
      <div className="absolute -bottom-32 left-1/3 w-80 h-80 bg-gradient-to-b from-orange-700/15 to-transparent rounded-full blur-3xl"></div>

      {/* Grid overlay */}
      <div className="absolute inset-0 opacity-40 pointer-events-none">
        <svg
          className="w-full h-full"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <defs>
            <pattern
              id="smallGridFooter"
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 20 0 L 0 0 0 20"
                fill="none"
                stroke="rgba(251, 146, 60, 0.3)"
                strokeWidth="0.7"
              />
            </pattern>
            <pattern
              id="gridFooter"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <rect width="100" height="100" fill="url(#smallGridFooter)" />
              <path
                d="M 100 0 L 0 0 0 100"
                fill="none"
                stroke="rgba(249, 115, 22, 0.4)"
                strokeWidth="1.2"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gridFooter)" />
        </svg>
      </div>

      {/* Footer Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* About */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">About Us</h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              We provide premium venues for your special occasions — crafted for
              elegance, celebration, and unforgettable memories.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { name: "Home", href: "/" },
                { name: "Venues", href: "/venues" },
                { name: "About", href: "/about" },
                { name: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-slate-400 hover:text-orange-400 transition-colors duration-300 text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <p className="text-slate-400 text-sm">
              123 Party Street, Fun City, FC 12345
            </p>
            <p className="text-slate-400 text-sm">
              Email: info@partyvenues.com
            </p>
            <p className="text-slate-400 text-sm">Phone: (123) 456-7890</p>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Newsletter</h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-3 py-2 bg-slate-800/70 border border-slate-700 rounded-md text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 transition-all"
                required
              />
              <button
                type="submit"
                className="w-full px-3 py-2 rounded-md font-semibold text-white bg-gradient-to-r from-slate-700 to-slate-800 border border-slate-600 hover:from-slate-600 hover:to-slate-700 hover:border-slate-500 transition-all duration-300 shadow-lg hover:shadow-xl active:scale-95"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Divider & Bottom Row */}
        <div className="mt-12 pt-8 border-t border-slate-700/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <p className="text-slate-500 text-xs md:text-sm">
              &copy; 2025 Party Venues. All rights reserved.
            </p>
            <div className="flex space-x-4 text-slate-400">
              {[FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn].map(
                (Icon, index) => (
                  <a
                    key={index}
                    href="#"
                    className="p-2 bg-slate-800/60 border border-slate-700 rounded-full hover:border-orange-500/50 hover:text-orange-400 transition-all duration-300"
                  >
                    <Icon size={14} />
                  </a>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
