import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../Header";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [certificates, setCertificates] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Fetch certificates and exams when session loads
  useEffect(() => {
    if (status === "authenticated" && session) {
      const fetchUrl = session.user.id 
        ? `/api/certificates?userId=${session.user.id}` 
        : `/api/certificates?userEmail=${session.user.email}`;

      fetch(fetchUrl, { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched certificates:", data);
          setCertificates(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching certificates:", err);
          setLoading(false);
        });

      // Fetch exams
      fetch("/api/exams", { cache: "no-store" })
        .then((res) => res.json())
        .then((data) => {
          console.log("Fetched exams:", data);
          setExams(data);
        })
        .catch((err) => console.error("Error fetching exams:", err));
    }
  }, [session, status]);

  if (status === "loading" || loading) return <p>Loading...</p>;

  return (
    <>
      <Header />
      <div className="p-8">
        <h1 className="text-3xl font-bold">Welcome, {session?.user.name}</h1>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
        >
          Logout
        </button>

        {/* Certificates Section */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold">Your Certificates</h2>
          {certificates.length === 0 ? (
            <p className="mt-4 text-gray-600">
              No certificates available at the moment.
            </p>
          ) : (
            <ul className="mt-4 space-y-4">
              {certificates.map((certificate) => (
                <li
                  key={certificate._id}
                  className="border p-4 rounded shadow hover:bg-gray-50"
                >
                  <p className="text-lg font-medium text-indigo-600">
                    Certificate for: {certificate.examName}
                  </p>
                  <p className="text-sm text-gray-500">
                    Issued on: {new Date(certificate.issuedAt).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-500">
                    Certificate ID: {certificate.certificateId}
                  </p>
                  <a
                    href={`/api/certificates?certificateNumber=${certificate.certificateId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-block text-blue-600 hover:underline"
                  >
                    View Certificate PDF
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Exams Section */}
        <section className="mt-8">
          <h2 className="text-2xl font-semibold">Your Exams</h2>
          {exams.length === 0 ? (
            <p className="mt-4 text-gray-600">
              No exams available at the moment.
            </p>
          ) : (
            <ul className="mt-4 space-y-4">
              {exams.map((exam) => (
                <li key={exam._id} className="border p-4 rounded shadow hover:bg-gray-50">
                  <Link href={`/exam/${exam._id}`} className="block">
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-medium text-indigo-600">{exam.title}</p>
                      <button className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 transition">
                        Take Exam
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">Available Anytime</p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
