import React, { useEffect, useState } from "react";

function AntiCheatingMulti({ onCheatingDetected, detectionThreshold = 3000 }) {
  const [cheating, setCheating] = useState(false);
  const [cheatCount, setCheatCount] = useState(0);
  // If the page is inactive for longer than this timeout, flag cheating.
  let visibilityTimeout;

  useEffect(() => {
    const handleVisibilityChange = () => {
      // When page becomes hidden, start a timer.
      if (document.hidden) {
        visibilityTimeout = setTimeout(() => {
          setCheating(true);
          setCheatCount((prev) => prev + 1);
          onCheatingDetected();
        }, detectionThreshold);
      } else {
        // When page is shown, clear any pending timeout.
        clearTimeout(visibilityTimeout);
        setCheating(false);
      }
    };

    const handleBlur = () => {
      // User left the window (e.g., switched tabs)
      visibilityTimeout = setTimeout(() => {
        setCheating(true);
        setCheatCount((prev) => prev + 1);
        onCheatingDetected();
      }, detectionThreshold);
    };

    const handleFocus = () => {
      clearTimeout(visibilityTimeout);
      setCheating(false);
    };

    // Optional: detect when mouse leaves the window
    const handleMouseLeave = (e) => {
      // If mouse leaves near the top (e.g., to the browser toolbar)
      if (e.clientY <= 0) {
        setCheating(true);
        setCheatCount((prev) => prev + 1);
        onCheatingDetected();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("mouseleave", handleMouseLeave);

    // Cleanup listeners
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(visibilityTimeout);
    };
  }, [onCheatingDetected, detectionThreshold]);

  return (
    <>
      {cheating && (
        <div className="fixed top-4 left-4 bg-red-600 text-white px-4 py-2 rounded shadow-md">
          Warning: Cheating Detected! (Count: {cheatCount})
        </div>
      )}
    </>
  );
}

export default AntiCheatingMulti;
