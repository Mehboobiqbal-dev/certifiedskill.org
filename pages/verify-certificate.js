import { useState } from 'react';
import Header from "./Header"; // Assuming these paths are correct
import Footer from "./Footer";
export default function VerifyCertificate() {
  const [certificateNumber, setCertificateNumber] = useState('');
  const [error, setError] = useState('');

  const handleVerify = () => {
    if (!certificateNumber) return;
    // Clear any previous error and open the PDF verification endpoint in a new tab.
    setError('');
    window.open(`/api/certificate/verify?certificateNumber=${certificateNumber}`, '_blank');
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-10">
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6">Verify Certificate</h1>
          <input
            type="text"
            placeholder="Enter Certificate Number"
            value={certificateNumber}
            onChange={(e) => setCertificateNumber(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mb-4 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={handleVerify}
            className="w-full bg-blue-500 hover:bg-blue-600 text-Black font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Verify
          </button>
          {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        </div>
      </main>
      <Footer />
    </>
  );
}
