import { useEffect, useState } from "react";

export default function StickyCTA() {
  const [visible, setVisible] = useState(true);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full z-40 bg-indigo-700 text-white flex items-center justify-between px-6 py-3 shadow-lg animate-fade-in-up">
      <div className="flex items-center gap-4">
        <span className="font-bold text-lg">🚀 Start Your Free Exam Now!</span>
        <span className="bg-indigo-900 text-xs rounded px-2 py-1 ml-2">Time on site: {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, "0")}</span>
      </div>
      <button
        className="bg-white text-indigo-700 font-semibold rounded px-4 py-2 ml-4 hover:bg-indigo-100 transition"
        onClick={() => setVisible(false)}
        aria-label="Dismiss CTA"
      >
        Dismiss
      </button>
    </div>
  );
} 