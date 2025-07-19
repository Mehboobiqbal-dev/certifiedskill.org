// pages/dashboard.js
import { useSession, signOut, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../Header";
import Skeleton from 'react-loading-skeleton';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const [certificates, setCertificates] = useState([]);
  const [exams, setExams] = useState([]);
  const [loadingCerts, setLoadingCerts] = useState(true);
  const [loadingExams, setLoadingExams] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session) {
      const fetchUrl = session.user.id
        ? `/api/certificates?userId=${session.user.id}`
        : `/api/certificates?userEmail=${session.user.email}`;
      fetch(fetchUrl, { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          setCertificates(data);
          setLoadingCerts(false);
        })
        .catch(() => setLoadingCerts(false));
    } else {
      setLoadingCerts(false);
    }
  }, [session, status]);

  useEffect(() => {
    fetch("/api/exams", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        setExams(data);
        setLoadingExams(false);
      })
      .catch(() => setLoadingExams(false));
  }, []);

  if (loadingExams || loadingCerts) return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-8 flex items-center justify-center">
      <div className="w-full max-w-5xl">
        <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <Skeleton height={36} width={260} style={{ marginBottom: 8 }} />
            <Skeleton height={24} width={320} />
          </div>
          <Skeleton height={44} width={120} />
        </div>
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-indigo-700 mb-6"><Skeleton width={180} /></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6 flex flex-col gap-2">
                <Skeleton height={28} width={180} />
                <Skeleton height={18} width={120} />
                <Skeleton height={18} width={200} />
                <Skeleton height={24} width={140} />
              </div>
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold text-indigo-700 mb-6"><Skeleton width={180} /></h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6 flex flex-col gap-2">
                <Skeleton height={28} width={180} />
                <Skeleton height={18} width={120} />
                <Skeleton height={24} width={140} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Welcome Area */}
          <div className="mb-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
                {status === "authenticated" ? `Welcome, ${session.user.name}` : "Exam Dashboard"}
              </h1>
              <p className="text-gray-600 text-lg">Manage your certifications and explore available exams.</p>
            </div>
            <div>
        {status === "authenticated" ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
                  className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-6 rounded-lg shadow transition"
            >
              Logout
            </button>
        ) : (
            <button
              onClick={() => signIn()}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow transition"
            >
              Login
            </button>
        )}
            </div>
          </div>

          {/* Certificates Section */}
        {status === "authenticated" && (
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-indigo-700 mb-6">Your Certificates</h2>
            {certificates.length === 0 ? (
                <div className="text-gray-500">No certificates available at the moment.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {certificates.map((certificate) => (
                    <div key={certificate._id} className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6 flex flex-col gap-2 hover:shadow-2xl transition">
                      <div className="flex items-center gap-3 mb-2">
                        <svg className="w-7 h-7 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" /></svg>
                        <span className="text-lg font-semibold text-indigo-700">{certificate.examName}</span>
                      </div>
                      <div className="text-sm text-gray-500">Issued: {new Date(certificate.issuedAt).toLocaleDateString()}</div>
                      <div className="text-sm text-gray-500">Certificate ID: {certificate.certificateId}</div>
                    <a
                      href={`/api/certificates?certificateNumber=${certificate.certificateId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                        className="mt-2 inline-block text-indigo-600 hover:underline font-medium"
                    >
                      View Certificate PDF
                    </a>
                    </div>
                ))}
                </div>
            )}
          </section>
        )}

          {/* Exams Section */}
          <section>
            <h2 className="text-2xl font-bold text-indigo-700 mb-6">Available Exams</h2>
          {exams.length === 0 ? (
              <div className="text-gray-500">No exams available at the moment.</div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {exams.map((exam) => (
                  <div key={exam._id} className="bg-white rounded-2xl shadow-lg border border-indigo-100 p-6 flex flex-col gap-2 hover:shadow-2xl transition">
                    <div className="flex items-center gap-3 mb-2">
                      <svg className="w-7 h-7 text-green-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 01-8 0" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v4m0 0a4 4 0 01-4 4H8a4 4 0 01-4-4V7a4 4 0 014-4h0a4 4 0 014 4z" /></svg>
                      <span className="text-lg font-semibold text-green-700">{exam.title}</span>
                    </div>
                    <div className="text-sm text-gray-500">Available Anytime</div>
                    <Link href={`/exam/${exam._id}`} className="mt-2 inline-block">
                      <span className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg shadow transition cursor-pointer">Take Exam</span>
                  </Link>
                  </div>
              ))}
              </div>
          )}
        </section>
      </div>
      </main>
    </>
  );
}
