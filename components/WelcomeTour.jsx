import { useState, useEffect } from "react";

const TOUR_STEPS = [
  {
    title: "Welcome to CertifiedSkill.org!",
    text: "Get industry-recognized certifications for free. Join thousands of professionals advancing their careers.",
  },
  {
    title: "Take Free Exams & Earn Certificates",
    text: "Choose from a variety of exams, prove your skills, and download digital certificates instantly.",
  },
  {
    title: "Explore Dashboard, Blog & More",
    text: "Track your progress, read expert tips, and discover new opportunities on your dashboard and blog.",
  },
];

export default function WelcomeTour() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("welcomeTourSeen")) {
      setTimeout(() => setOpen(true), 1200); // Show after 1.2s
    }
  }, []);

  const handleNext = () => {
    if (step < TOUR_STEPS.length - 1) {
      setStep(step + 1);
    } else {
      setOpen(false);
      if (typeof window !== "undefined") {
        localStorage.setItem("welcomeTourSeen", "1");
      }
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-8 text-center relative animate-fade-in">
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-indigo-600 text-xl font-bold focus:outline-none"
          onClick={() => { setOpen(false); localStorage.setItem("welcomeTourSeen", "1"); }}
          aria-label="Close tour"
        >
          &times;
        </button>
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-indigo-700 mb-2">{TOUR_STEPS[step].title}</h2>
          <p className="text-gray-600 text-base">{TOUR_STEPS[step].text}</p>
        </div>
        <div className="flex justify-center gap-2 mb-4">
          {TOUR_STEPS.map((_, i) => (
            <span key={i} className={`w-3 h-3 rounded-full ${i === step ? "bg-indigo-600" : "bg-indigo-200"}`}></span>
          ))}
        </div>
        <button
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded px-6 py-2 mt-2 transition"
          onClick={handleNext}
          autoFocus
        >
          {step < TOUR_STEPS.length - 1 ? "Next" : "Get Started"}
        </button>
      </div>
    </div>
  );
} 