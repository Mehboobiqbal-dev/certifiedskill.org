import Header from "./Header";
import Footer from "./Footer";
import { useEffect, useState } from "react";
import Skeleton from 'react-loading-skeleton';

export default function AdminPanel() {
  // TODO: Replace with real admin authentication
  const isAdmin = true;
  const [users, setUsers] = useState([]);
  const [exams, setExams] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch('/api/users').then(res => res.json()),
      fetch('/api/exams').then(res => res.json()),
      fetch('/api/certificates').then(res => res.json()),
    ]).then(([users, exams, certificates]) => {
      setUsers(users);
      setExams(exams);
      setCertificates(certificates);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (!isAdmin) {
    return <div className="min-h-screen flex items-center justify-center text-red-500 font-bold">Access Denied</div>;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 flex flex-col items-center">
        <div className="w-full max-w-5xl bg-white rounded-2xl shadow-xl border border-indigo-100 p-8">
          <h1 className="text-3xl font-bold text-indigo-700 mb-8 text-center">Admin Dashboard</h1>
          {/* User management */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-indigo-700 mb-4">Users</h2>
            {loading ? <Skeleton count={3} height={40} className="mb-2" /> : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-indigo-50">
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Email</th>
                      <th className="p-2 text-left">Role</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id} className="border-b">
                        <td className="p-2">{user.name}</td>
                        <td className="p-2">{user.email}</td>
                        <td className="p-2">{user.role || 'user'}</td>
                        <td className="p-2 flex gap-2">
                          <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-2 py-1 rounded">Edit</button>
                          <button className="bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {/* Exam management */}
          <div className="mb-8">
            <h2 className="text-xl font-bold text-indigo-700 mb-4">Exams</h2>
            {loading ? <Skeleton count={2} height={40} className="mb-2" /> : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-indigo-50">
                      <th className="p-2 text-left">Title</th>
                      <th className="p-2 text-left">Questions</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {exams.map(exam => (
                      <tr key={exam._id} className="border-b">
                        <td className="p-2">{exam.title}</td>
                        <td className="p-2">{exam.questions?.length || 0}</td>
                        <td className="p-2 flex gap-2">
                          <button className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-2 py-1 rounded">Edit</button>
                          <button className="bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          {/* Certificate management */}
          <div>
            <h2 className="text-xl font-bold text-indigo-700 mb-4">Certificates</h2>
            {loading ? <Skeleton count={2} height={40} className="mb-2" /> : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-indigo-50">
                      <th className="p-2 text-left">Exam</th>
                      <th className="p-2 text-left">User</th>
                      <th className="p-2 text-left">Issued</th>
                      <th className="p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {certificates.map(cert => (
                      <tr key={cert._id} className="border-b">
                        <td className="p-2">{cert.examName}</td>
                        <td className="p-2">{cert.userName || cert.userEmail}</td>
                        <td className="p-2">{new Date(cert.issuedAt).toLocaleDateString()}</td>
                        <td className="p-2 flex gap-2">
                          <a href={`/certificate/${cert.certificateId}`} className="bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-2 py-1 rounded">View</a>
                          <button className="bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded">Revoke</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 