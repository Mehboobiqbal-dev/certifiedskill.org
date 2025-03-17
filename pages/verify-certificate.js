// pages/verify-certificate.js
import { useState } from 'react';

export default function VerifyCertificate() {
  const [certificateNumber, setCertificateNumber] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleVerify = async () => {
    setError('');
    setResult(null);
    try {
      const res = await fetch(`/api/certificate/verify?certificateNumber=${certificateNumber}`);
      if (!res.ok) {
        throw new Error('Certificate not found');
      }
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Verify Certificate</h1>
      <input
        type="text"
        placeholder="Enter Certificate Number"
        value={certificateNumber}
        onChange={(e) => setCertificateNumber(e.target.value)}
        style={{ padding: '0.5rem', marginRight: '1rem' }}
      />
      <button onClick={handleVerify}>Verify</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && (
        <div>
          <h2>Certificate Details</h2>
          <p><strong>Name:</strong> {result.userName}</p>
          <p><strong>Exam:</strong> {result.examName}</p>
          <p><strong>Issued At:</strong> {new Date(result.issuedAt).toLocaleDateString()}</p>
          <p><strong>Certificate Number:</strong> {result.certificateNumber}</p>
        </div>
      )}
    </div>
  );
}
