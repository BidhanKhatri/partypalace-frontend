import React, { useEffect } from "react";
import Lenis from "lenis";

const SmoothScroll = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: "0.1",
      smoothWheel: true,
      smoothTouch: true,
      mouseMultiplier: 1,
      touchMultiplier: 2,
    });

    const animate = (time) => {
      lenis.raf(time);
      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    return () => lenis.destroy();
  }, []);

  return <div>{children}</div>;
};

export default SmoothScroll;
