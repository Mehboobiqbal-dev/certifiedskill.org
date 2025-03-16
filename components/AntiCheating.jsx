// /components/AntiCheating.jsx
import { FaceDetection } from '@mediapipe/face_detection';
import { useEffect, useRef, useState } from 'react';

function AntiCheating({ onCheatingDetected }) {
  const videoRef = useRef(null);
  const [isCheating, setIsCheating] = useState(false);

  useEffect(() => {
    if (!videoRef.current) return;

    // Initialize Face Detection from Mediapipe.
    const faceDetection = new FaceDetection({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
    });

    faceDetection.setOptions({
      model: 'short',
      minDetectionConfidence: 0.5,
    });

    faceDetection.onResults((results) => {
      // If no faces are detected, flag cheating.
      if (!results.detections || results.detections.length === 0) {
        setIsCheating(true);
        onCheatingDetected();
      } else {
        setIsCheating(false);
      }
    });

    // Dynamically load Camera Utils from CDN.
    const loadCameraUtilsScript = () => {
      return new Promise((resolve, reject) => {
        if (document.getElementById('mediapipe-camera-utils')) {
          resolve();
        } else {
          const script = document.createElement('script');
          script.src =
            'https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js';
          script.id = 'mediapipe-camera-utils';
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () =>
            reject(new Error('Failed to load Camera Utils script.'));
          document.body.appendChild(script);
        }
      });
    };

    let cameraInstance;
    loadCameraUtilsScript()
      .then(() => {
        if (videoRef.current && window.Camera) {
          cameraInstance = new window.Camera(videoRef.current, {
            onFrame: async () => {
              await faceDetection.send({ image: videoRef.current });
            },
            width: 640,
            height: 480,
          });
          cameraInstance.start();
        }
      })
      .catch((error) => console.error(error));

    return () => {
      if (cameraInstance && cameraInstance.stop) {
        cameraInstance.stop();
      }
    };
  }, [onCheatingDetected]);

  return (
    <div>
      {/* Hidden video element used for processing */}
      <video ref={videoRef} className="hidden" playsInline></video>
      {isCheating && (
        <div className="fixed top-4 left-4 bg-red-600 text-white px-4 py-2 rounded shadow-md">
          Warning: Cheating Detected!
        </div>
      )}
    </div>
  );
}

export default AntiCheating;
