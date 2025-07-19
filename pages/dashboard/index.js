// pages/dashboard.js
import { useSession, signOut, signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../Header";
import Footer from "../Footer";
import { FaCertificate, FaCheckCircle, FaBookOpen, FaArrowRight, FaDownload } from "react-icons/fa";
import Skeleton from 'react-loading-skeleton';
import SeoHead from "../../components/SeoHead";
import WelcomeTour from "../../components/WelcomeTour";

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
      <SeoHead
        title="Dashboard | CertifiedSkill.org"
        description="Access your certificates, exams, and account on your CertifiedSkill.org dashboard."
        canonical="https://certifiedskill.org/dashboard"
      />
      <WelcomeTour />
      <Header />
      {/* User Profile Card */}
      <div className="flex items-center gap-4 bg-white rounded-xl shadow p-6 mb-8 max-w-md mx-auto mt-8">
        <div className="relative">
          <img
            src="https://randomuser.me/api/portraits/men/32.jpg"
            alt="Amit S."
            className="w-16 h-16 rounded-full border-2 border-green-400 shadow"
          />
          <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
        </div>
        <div>
          <div className="text-lg font-semibold text-gray-800">Amit S.</div>
          <div className="text-sm text-gray-500">Software Engineer</div>
          <div className="flex items-center gap-2 mt-1">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
            <span className="text-xs text-green-600">Online</span>
          </div>
        </div>
      </div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-blue-400 to-indigo-200 py-16 px-4 flex flex-col items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('/dashboard-bg.jpg')] bg-cover bg-center opacity-10 pointer-events-none" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-white drop-shadow mb-4">
          {status === "authenticated" ? `Welcome, ${session.user.name}` : "Exam Dashboard"}
        </h1>
        <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto mb-6">
          Manage your certifications, track your progress, and take new exams to boost your skills.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
        {status === "authenticated" ? (
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-700 hover:to-red-500 text-white font-bold py-2 px-8 rounded-lg shadow transition text-lg"
            >
              Logout
            </button>
        ) : (
            <button
              onClick={() => signIn()}
              className="bg-gradient-to-r from-indigo-600 to-blue-400 hover:from-blue-400 hover:to-indigo-600 text-white font-bold py-2 px-8 rounded-lg shadow transition text-lg"
            >
              Login
            </button>
          )}
        </div>
      </section>
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Certificates Section */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-indigo-700 mb-8 flex items-center gap-2"><FaCertificate className="text-yellow-500" /> My Certificates</h2>
            {certificates.length === 0 ? (
              <div className="bg-indigo-50 rounded-lg p-6 text-center text-gray-500">No certificates yet. Take an exam to earn your first certificate!</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {certificates.map((certificate) => (
                  <div key={certificate._id} className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-6 flex flex-col gap-3 hover:shadow-2xl transition group">
                    <div className="flex items-center gap-3 mb-2">
                      <FaCertificate className="w-7 h-7 text-yellow-500 group-hover:scale-110 transition-transform" />
                      <span className="text-lg font-semibold text-indigo-700">{certificate.examName}</span>
                      <span className="ml-auto inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full"><FaCheckCircle className="w-4 h-4" /> Passed</span>
                    </div>
                    <div className="text-sm text-gray-500">Issued: {new Date(certificate.issuedAt).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-500">Certificate ID: {certificate.certificateId}</div>
                    <div className="flex gap-2 mt-2">
       
                      <a href={`/certificate/${certificate.certificateId}.pdf`} target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white font-bold py-2 px-4 rounded-lg shadow transition text-sm flex items-center gap-2"><FaDownload /> Download PDF</a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
          {/* Exams Section */}
          <section>
            <h2 className="text-2xl font-bold text-indigo-700 mb-8 flex items-center gap-2"><FaBookOpen className="text-blue-500" /> Available Exams</h2>
          {exams.length === 0 ? (
              <div className="bg-indigo-50 rounded-lg p-6 text-center text-gray-500">No exams available at the moment.</div>
          ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {exams.map((exam) => (
                  <div key={exam._id} className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-6 flex flex-col gap-3 hover:shadow-2xl transition group">
                    <div className="flex items-center gap-3 mb-2">
                      <FaBookOpen className="w-7 h-7 text-blue-500 group-hover:scale-110 transition-transform" />
                      <span className="text-lg font-semibold text-blue-700">{exam.title}</span>
                    </div>
                    <div className="text-sm text-gray-500">Available Anytime</div>
                    {/* Example progress bar for demo purposes */}
                    <div className="w-full bg-indigo-100 rounded-full h-2 mt-2">
                      <div className="bg-gradient-to-r from-indigo-600 to-blue-400 h-2 rounded-full transition-all" style={{ width: "0%" }} />
                    </div>
                    <Link href={`/exam/${exam._id}`} className="mt-4 inline-block">
                      <span className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-500 text-white font-bold py-2 px-6 rounded-lg shadow transition cursor-pointer flex items-center gap-2"><FaArrowRight /> Take Exam</span>
                  </Link>
                  </div>
              ))}
              </div>
          )}
        </section>
      </div>
      </main>
      <Footer />
    </>
  );
}
