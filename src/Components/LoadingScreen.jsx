import { useEffect, useState } from "react";

const LoadingScreen = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Timer for fading
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 2000);

    // Timer for removing the loading screen after fade
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 2500);

    // Cleanup timers on component unmount
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null; // Don't render anything if not visible

  return (
    <div
      className={`fixed inset-0 top-0 left-0 w-screen h-screen flex items-center justify-center bg-black text-white z-50 transition-opacity duration-500 ${
        isFading ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Optional Spinner */}
      {/* <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-300 mb-4"></div> */}

      {/* Text Display */}
      <p className="animate-pulse text-lg md:text-9xl">ACTIONOTE</p>
    </div>
  );
};

export default LoadingScreen;