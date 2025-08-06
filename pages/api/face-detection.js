// pages/api/face-detection.js
// This file is separated to reduce serverless function size

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      // Only import face detection libraries when this endpoint is called
      const faceapi = await import('face-api.js');
      const { Canvas, Image } = await import('@mediapipe/camera_utils');
      const { FaceDetection } = await import('@mediapipe/face_detection');
      
      // Configure node-canvas (if needed)
      const canvas = await import('canvas');
      const { Canvas: NodeCanvas, Image: NodeImage } = canvas;
      faceapi.env.monkeyPatch({ Canvas: NodeCanvas, Image: NodeImage });
      
      const { imageData } = req.body;
      
      if (!imageData) {
        return res.status(400).json({ error: 'Image data is required' });
      }
      
      // Load the models (adjust paths as needed)
      await faceapi.nets.tinyFaceDetector.loadFromDisk('models');
      await faceapi.nets.faceLandmark68Net.loadFromDisk('models');
      
      // Process the image
      const img = new NodeImage();
      img.src = imageData;
      
      const detections = await faceapi.detectAllFaces(img, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks();
      
      return res.status(200).json({ detections });
    } catch (error) {
      console.error('Face detection failed:', error);
      return res.status(500).json({ error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}