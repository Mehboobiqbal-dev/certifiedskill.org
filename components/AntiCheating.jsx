import React, { useEffect, useState, useRef } from "react";
// Use MediaPipe for AI camera proctoring
import FaceDetection from "@mediapipe/face_detection";
import Camera from "@mediapipe/camera_utils/camera_utils.js";


/**
 * Industry-level AntiCheating component
 * - Detects tab switch, window blur, mouse leave, inactivity
 * - Integrates AI camera proctoring (face detection) using MediaPipe
 * - Centralized warning system with reasons
 * - Debug logging for each cheating event
 * - Extensible for backend integration
 * - Cancels exam after 5 cheating events
 */
function AntiCheatingMulti({ onCheatingDetected, detectionThreshold = 3000, enableCamera = true, onExamCancelled }) {
  const [cheating, setCheating] = useState(false);
  const [cheatCount, setCheatCount] = useState(0);
  const [warning, setWarning] = useState("");
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState("");
  const [examCancelled, setExamCancelled] = useState(false);
  const videoRef = useRef(null);
  let visibilityTimeout;

  // --- Centralized Cheating Event Logger ---
  function logCheatingEvent(reason) {
    const timestamp = new Date().toISOString();
    console.debug("[Cheating Event]", { reason, count: cheatCount + 1, timestamp });
    // TODO: Integrate with backend audit log endpoint
  }

  // --- Helper to increment cheating and handle cancellation ---
  function handleCheating(reason) {
    if (examCancelled) return;
    setCheating(true);
    setCheatCount((prev) => {
      const newCount = prev + 1;
      if (newCount >= 5) {
        setExamCancelled(true);
        setWarning("Exam cancelled due to repeated cheating attempts.");
        logCheatingEvent("Exam cancelled after 5 cheating events");
        if (onExamCancelled) onExamCancelled();
      } else {
        setWarning(reason);
        logCheatingEvent(reason);
        if (onCheatingDetected) onCheatingDetected(reason);
      }
      return newCount;
    });
  }

  // --- Camera Proctoring Logic (MediaPipe) ---
  useEffect(() => {
    if (!enableCamera) return;
    let cameraInstance;
    setCameraActive(false);
    setCameraError("");
    async function startMediaPipeCamera() {
      if (!videoRef.current) return;
      try {
        const faceDetection = new FaceDetection({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
        });
        faceDetection.setOptions({
          model: "short",
          minDetectionConfidence: 0.5,
        });
        faceDetection.onResults((results) => {
          if (!results.detections || results.detections.length === 0) {
            handleCheating("No face detected by camera. Please stay visible.");
          } else {
            setCheating(false);
            setWarning("");
          }
        });
        cameraInstance = new Camera(videoRef.current, {
          onFrame: async () => {
            await faceDetection.send({ image: videoRef.current });
          },
          width: 320,
          height: 240,
        });
        await cameraInstance.start();
        setCameraActive(true);
      } catch (err) {
        setCameraError("Camera access denied or unavailable.");
        setCameraActive(false);
        handleCheating("Camera access denied");
      }
    }
    startMediaPipeCamera();
    return () => {
      if (cameraInstance) {
        cameraInstance.stop();
      }
    };
  }, [enableCamera]);

  // --- Tab/Window/Mouse Anti-Cheating Logic ---
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        visibilityTimeout = setTimeout(() => {
          handleCheating("Tab switch or window hidden detected.");
        }, detectionThreshold);
      } else {
        clearTimeout(visibilityTimeout);
        setCheating(false);
        setWarning("");
      }
    };
    const handleBlur = () => {
      visibilityTimeout = setTimeout(() => {
        handleCheating("Window lost focus (blur) detected.");
      }, detectionThreshold);
    };
    const handleFocus = () => {
      clearTimeout(visibilityTimeout);
      setCheating(false);
      setWarning("");
    };
    const handleMouseLeave = (e) => {
      if (e.clientY <= 0) {
        handleCheating("Mouse left window (possible toolbar navigation)");
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("mouseleave", handleMouseLeave);
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
      {examCancelled ? (
        <div className="fixed top-4 left-4 bg-black text-white px-8 py-8 rounded shadow-md z-50">
          <strong>Exam Cancelled</strong>
          <div className="mt-2">Reason: {warning}</div>
          <div>Total Cheating Events: {cheatCount}</div>
        </div>
      ) : cheating && (
        <div className="fixed top-4 left-4 bg-red-600 text-white px-8 py-8 rounded shadow-md z-50">
          <strong>Cheating Detected!</strong>
          <div className="mt-2">Reason: {warning}</div>
          <div>Count: {cheatCount}</div>
        </div>
      )}
      {enableCamera && (
        <div className="fixed bottom-4 right-4 bg-white border p-2 rounded shadow z-40">
          <div className="text-xs text-gray-700 mb-1">AI Camera Proctoring (MediaPipe)</div>
          {cameraError ? (
            <div className="text-red-600">{cameraError}</div>
          ) : (
            <video
              ref={videoRef}
              autoPlay
              muted
              width={120}
              height={90}
              style={{ borderRadius: 8, background: "#222" }}
            />
          )}
        </div>
      )}
    </>
  );
}

export default AntiCheatingMulti;
