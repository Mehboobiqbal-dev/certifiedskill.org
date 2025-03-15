import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';

export default function Exam({ exam }) {
  const { status } = useSession();
  const router = useRouter();
  const [answers, setAnswers] = useState({});
  const videoRef = useRef(null);
  const [cheatingDetected, setCheatingDetected] = useState(false);

  useEffect(() => {
    // Redirect if not signed in
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }

    // Tab change detection
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setCheatingDetected(true);
        alert('Tab change detected! This will be flagged.');
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Face detection setup using global FaceDetection loaded via CDN
    const setupFaceDetection = () => {
      if (typeof window !== 'undefined' && window.FaceDetection) {
        const faceDetection = new window.FaceDetection({
          locateFile: (file) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/${file}`,
        });
        faceDetection.setOptions({ model: 'short', minDetectionConfidence: 0.5 });
        faceDetection.onResults((results) => {
          if (!results.detections || !results.detections.length) {
            setCheatingDetected(true);
            alert('No face detected! Please stay in view.');
          }
        });

        const video = videoRef.current;
        navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
          video.srcObject = stream;
          video.play();
          const detect = () =>
            faceDetection.send({ image: video }).then(() => requestAnimationFrame(detect));
          detect();
        });
      } else {
        console.error('FaceDetection is not available on window.');
      }
    };

    setupFaceDetection();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [status, router]);

  const handleSubmit = async () => {
    const res = await fetch('/api/submit-exam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ examId: exam._id, answers: Object.values(answers) }),
    });
    if (res.ok) {
      alert('Exam submitted!');
      router.push('/dashboard');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <Head>
        {/* Load the Mediapipe Face Detection script from the CDN */}
        <script
          src="https://cdn.jsdelivr.net/npm/@mediapipe/face_detection/face_detection.js"
          crossOrigin="anonymous"
        />
      </Head>
      <h1>{exam.title}</h1>
      <video
        ref={videoRef}
        width="320"
        height="240"
        style={{ position: 'fixed', top: 10, right: 10 }}
      />
      {exam.questions.map((q, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <p>{q.questionText}</p>
          {q.options.map((option, i) => (
            <label key={i}>
              <input
                type="radio"
                name={`question-${index}`}
                value={option}
                onChange={() => setAnswers({ ...answers, [index]: option })}
              />
              {option}
            </label>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit} disabled={cheatingDetected}>
        Submit Exam
      </button>
      {cheatingDetected && (
        <p style={{ color: 'red' }}>
          Cheating detected! Resolve issues to submit.
        </p>
      )}
    </div>
  );
}

export async function getServerSideProps({ params }) {
  // Note the updated URL to use the plural "exams" dynamic API route
  const res = await fetch(`https://3000-idx-get-certified-1742011310099.cluster-nx3nmmkbnfe54q3dd4pfbgilpc.cloudworkstations.dev/api/exams/${params.id}`);
  const exam = await res.json();
  return { props: { exam } };
}
