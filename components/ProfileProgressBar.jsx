import { useState } from "react";

const STEPS = [
  { label: "Complete Profile", done: false },
  { label: "Start Exam", done: false },
  { label: "Read Blog", done: false },
  { label: "View FAQ", done: false },
];

export default function ProfileProgressBar() {
  // Dummy: all steps except first are incomplete
  const completed = 1; // Change logic to real completion later
  const percent = (completed / STEPS.length) * 100;
  return (
    <div className="bg-white rounded-xl shadow p-6 mb-8 max-w-xl mx-auto mt-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-semibold text-gray-700">Profile Progress</span>
        <span className="text-xs text-gray-500">{Math.round(percent)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
        <div
          className="bg-indigo-600 h-3 rounded-full transition-all duration-500"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
      <div className="flex flex-wrap gap-3">
        {STEPS.map((step, i) => (
          <div key={step.label} className={`flex items-center gap-1 text-xs ${i < completed ? "text-green-600" : "text-gray-400"}`}>
            <span className={`inline-block w-2 h-2 rounded-full ${i < completed ? "bg-green-500" : "bg-gray-300"}`}></span>
            {step.label}
          </div>
        ))}
      </div>
    </div>
  );
} 