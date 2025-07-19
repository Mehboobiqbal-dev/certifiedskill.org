import Header from "../Header";
import Footer from "../Footer";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Skeleton from 'react-loading-skeleton';

export default function CertificateDetail() {
  const router = useRouter();
  const { id } = router.query;
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/certificates?certificateNumber=${id}`)
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        setCertificate(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 flex flex-col items-center">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-indigo-100 p-8">
          <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">Certificate</h1>
          {loading ? (
            <>
              <Skeleton height={24} width={180} className="mb-6 mx-auto" />
              <Skeleton height={32} width={320} className="mb-6 mx-auto" />
              <Skeleton height={200} className="mb-6" />
              <Skeleton height={44} width={160} className="mb-4 mx-auto" />
            </>
          ) : certificate && certificate.certificateId ? (
            <>
              <div className="mb-6 text-center text-gray-500">Certificate ID: {certificate.certificateId}</div>
              <div className="bg-indigo-50 rounded-lg p-8 text-center text-gray-900 mb-6">
                <div className="text-xl font-bold mb-2">{certificate.examName}</div>
                <div className="mb-2">Awarded to <span className="font-semibold">{certificate.userName || certificate.userEmail}</span></div>
                <div className="mb-2">Issued: {new Date(certificate.issuedAt).toLocaleDateString()}</div>
                <div className="text-sm text-gray-500">This certificate is verifiable at the link below.</div>
              </div>
              <div className="flex flex-col md:flex-row gap-4 justify-center mb-8">
                <a href={`/certificate/${certificate.certificateId}.pdf`} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white font-bold py-2 px-6 rounded-lg shadow transition flex items-center gap-2">Download PDF</a>
              </div>
              <div className="mt-6 text-center">
                <span className="text-gray-600">Shareable Link:</span>
                <span className="ml-2 text-indigo-700 font-mono">{`https://certifiedskill.org/certificate/${certificate.certificateId}`}</span>
              </div>
            </>
          ) : (
            <div className="text-center text-red-500">Certificate not found.</div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
} 