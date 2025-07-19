import { useState } from 'react';
import Header from "./Header";
import Footer from "./Footer";
import Skeleton from 'react-loading-skeleton';

export default function VerifyCertificate() {
  const [certificateNumber, setCertificateNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = () => {
    if (!certificateNumber) {
      setError('Please enter a certificate number.');
      return;
    }
    setError('');
    setLoading(true);
    window.open(`/api/certificate/verify?certificateNumber=${certificateNumber}`, '_blank');
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col items-center justify-center py-16 px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-indigo-100 p-8">
          <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Verify Certificate</h1>
          <div className="w-full p-3 border border-indigo-200 rounded-lg mb-4 focus-within:outline-none focus-within:border-indigo-500 text-lg">
            {loading ? (
              <Skeleton width="100%" height="40px" />
            ) : (
          <input
            type="text"
            placeholder="Enter Certificate Number"
            value={certificateNumber}
            onChange={(e) => setCertificateNumber(e.target.value)}
                className="w-full"
          />
            )}
          </div>
          <button
            onClick={handleVerify}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow transition text-lg"
          >
            {loading ? <Skeleton width="100%" height="40px" /> : 'Verify'}
          </button>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
      </main>
      <Footer />
    </>
  );
}
