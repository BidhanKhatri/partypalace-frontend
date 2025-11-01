import React from "react";
import { motion, AnimatePresence } from "motion/react";

const MacScrollEffect = ({ children }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ x: "100%", opacity: 0 }}
        animate={{ x: "0%", opacity: 1 }}
        exit={{ x: "-100%", opacity: 0 }}
        transition={{
          type: "tween",
          duration: "0.5",
          ease: "easeInOut",
          stiffness: 100, // Less stiffness for smoothness
          damping: 20, // Higher damping for a softer effect
          mass: 0.8, // Adjusts weight of movement
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default MacScrollEffect;
