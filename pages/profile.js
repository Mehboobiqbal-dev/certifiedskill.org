import Header from "./Header";
import Footer from "./Footer";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Skeleton from 'react-loading-skeleton';

export default function Profile() {
  const { data: session, status } = useSession();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "" });
  const [certificates, setCertificates] = useState([]);
  const [loadingCerts, setLoadingCerts] = useState(true);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session) {
      setForm({ name: session.user.name, email: session.user.email });
      // Fetch certificates for the user
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
    }
  }, [session, status]);

  const handleEdit = () => setEditing(true);
  const handleCancel = () => {
    setEditing(false);
    setForm({ name: session.user.name, email: session.user.email });
  };
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSave = (e) => {
    e.preventDefault();
    setPending(true);
    // TODO: Implement backend update for user profile
    setTimeout(() => {
      setPending(false);
      setEditing(false);
    }, 1000);
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 flex flex-col items-center">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-indigo-100 p-8">
          <h1 className="text-3xl font-bold text-indigo-700 mb-8 text-center">My Profile</h1>
          {/* User avatar, name, email, edit button */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-24 h-24 rounded-full bg-indigo-100 mb-4 flex items-center justify-center text-3xl font-bold text-indigo-700">
              {status === "loading" ? <Skeleton circle height={96} width={96} /> : (session?.user?.name?.[0] || "U")}
            </div>
            {editing ? (
              <form className="flex flex-col items-center gap-2 w-full max-w-xs" onSubmit={handleSave}>
                <input name="name" value={form.name} onChange={handleChange} className="w-full p-2 border border-indigo-200 rounded mb-2" />
                <input name="email" value={form.email} onChange={handleChange} className="w-full p-2 border border-indigo-200 rounded mb-2" disabled />
                <div className="flex gap-2 mt-2">
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-lg shadow transition" disabled={pending}>{pending ? <Skeleton width={60} /> : "Save"}</button>
                  <button type="button" className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg shadow transition" onClick={handleCancel}>Cancel</button>
                </div>
              </form>
            ) : (
              <>
                <div className="text-lg font-semibold text-gray-900">{status === "loading" ? <Skeleton width={120} /> : session?.user?.name}</div>
                <div className="text-gray-500">{status === "loading" ? <Skeleton width={180} /> : session?.user?.email}</div>
                <button className="mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-lg shadow transition" onClick={handleEdit}>Edit Profile</button>
              </>
            )}
          </div>
          {/* Certificate list */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-indigo-700 mb-4">My Certificates</h2>
            {loadingCerts ? (
              <Skeleton count={2} height={60} className="mb-2" />
            ) : certificates.length === 0 ? (
              <div className="bg-indigo-50 rounded-lg p-4 text-center text-gray-500">No certificates yet.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.map((certificate) => (
                  <div key={certificate._id} className="bg-indigo-50 rounded-lg p-4 flex flex-col gap-1">
                    <div className="font-semibold text-indigo-700">{certificate.examName}</div>
                    <div className="text-sm text-gray-500">Issued: {new Date(certificate.issuedAt).toLocaleDateString()}</div>
                    <div className="text-sm text-gray-500">Certificate ID: {certificate.certificateId}</div>
                    <a href={`/certificate/${certificate.certificateId}`} className="text-indigo-600 hover:underline text-sm mt-1">View Certificate</a>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* Account settings (change password, etc.) */}
          <div>
            <h2 className="text-xl font-bold text-indigo-700 mb-4">Account Settings</h2>
            {/* TODO: Implement change password and delete account */}
            <button className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-6 rounded-lg shadow transition">Change Password</button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 