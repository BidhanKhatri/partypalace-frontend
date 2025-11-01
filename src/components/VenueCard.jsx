const containerVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import {
  FaClock,
  FaLocationArrow,
  FaRegBookmark,
  FaRegHeart,
  FaUsers,
  FaHeart,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const VenueCard = ({
  name = "Sample Venue",
  description = "Premium venue for your special events",
  location = "Kathmandu",
  capacity = 100,
  pricePerHour = 5000,
  images = ["https://via.placeholder.com/400"],
  toggleLike = () => {},
  partyPalaceId = "1",
  _id = "1",
  likedBy = [],
  userId = "user1",
  totalLikes = 0,
  category,
}) => {
  const isLoved = likedBy.some((el) => el === userId);
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const imageVariants = {
    hover: { scale: 1.1, transition: { duration: 0.4 } },
  };

  const likeButtonVariants = {
    tap: { scale: 0.8, rotate: 10 },
  };

  return (
    <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className="w-full h-full"
    >
      <div className="relative w-full h-80 rounded-xl overflow-hidden group cursor-pointer">
        {/* Background Image with Overlay */}
        <motion.div
          className="absolute inset-0 overflow-hidden"
          whileHover="hover"
        >
          <motion.img
            src={images[0] || "https://via.placeholder.com/400"}
            alt={name}
            className="w-full h-full object-cover"
            variants={imageVariants}
          />

          {/* Dark Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/80" />

          {/* Accent Line */}
          <div className="absolute top-0 left-0 w-1 h-12 bg-gradient-to-b from-orange-400 to-transparent" />
          <div className="absolute bottom-0 right-0 w-1 h-12 bg-gradient-to-b from-orange-400 to-transparent" />
        </motion.div>

        {/* Like Button */}
        <motion.button
          className="absolute top-3 right-3 z-20 backdrop-blur-md bg-white/10 border border-white/20 rounded-full p-2 hover:bg-white/20 hover:border-orange-400/50 transition-all duration-300"
          onClick={() => toggleLike(partyPalaceId || _id)}
          variants={likeButtonVariants}
          whileTap="tap"
        >
          {isLoved ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <FaHeart className="text-red-500 text-sm" />
            </motion.div>
          ) : (
            <FaRegHeart className="text-white text-sm" />
          )}
        </motion.button>

        {/* Content Overlay - Bottom Section */}
        <div className="absolute inset-0 flex flex-col justify-between p-4 z-10">
          {/* Top Section with Category Badge */}
          <div className="flex justify-between items-start">
            {category.length > 0 && (
              <motion.span
                className="inline-flex items-center gap-1 bg-amber-500/90 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-semibold text-white shadow-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {category.join(', ')}
              </motion.span>
            )}
            {totalLikes > 0 && (
              <motion.div
                className="flex items-center gap-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-2 py-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                <FaHeart className="text-orange-400 text-xs" />
                <span className="text-white text-xs font-medium">
                  {totalLikes}
                </span>
              </motion.div>
            )}
          </div>

          {/* Bottom Content */}
          <motion.div
            className="space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            {/* Title */}
            <div>
              <h3 className="text-white font-bold text-lg leading-tight truncate">
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </h3>
              <p className="text-slate-300 text-xs mt-1 line-clamp-1 font-light">
                {description}
              </p>
            </div>

            {/* Details Row 1 - Location and Capacity */}
            <div className="flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-1.5 text-slate-200">
                <FaLocationArrow className="text-amber-400 flex-shrink-0" />
                <span className="truncate">{location}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-200">
                <FaUsers className="text-amber-400 flex-shrink-0" />
                <span>{capacity}</span>
              </div>
            </div>

            {/* Details Row 2 - Price and Button */}
            <div className="flex items-center justify-between pt-2 border-t border-white/10">
              <div className="flex items-center gap-1.5 text-white font-semibold">
                <FaClock className="text-amber-400 text-xs flex-shrink-0" />
                <span className="text-sm">Rs {pricePerHour}</span>
              </div>

              <Link
                to={`/booking/${partyPalaceId || _id}`}
                className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-orange-500 text-white rounded-lg px-3 py-1.5 text-xs font-semibold shadow-lg hover:shadow-orange-500/40 transition-all duration-300 border border-orange-400/30"
              >
                View
                <FaArrowRight className="text-xs" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-t from-orange-500/0 via-transparent to-transparent" />
        </div>
      </div>
    </motion.div>
  );
};

export default VenueCard;
