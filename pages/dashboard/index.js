import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [exams, setExams] = useState([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
      return;
    }
    fetch('/api/exams')
      .then((res) => res.json())
      .then(setExams)
      .catch((err) => console.error('Error fetching exams:', err));
  }, [session, status, router]);

  if (status === 'loading') return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold">Welcome, {session?.user.name}</h1>
      <button 
        onClick={() => signOut({ callbackUrl: '/' })}
        className="mt-4 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded"
      >
        Logout
      </button>
      <h2 className="mt-8 text-2xl font-semibold">Available Exams</h2>
      {exams.length === 0 ? (
        <p className="mt-4 text-gray-600">No exams available at the moment.</p>
      ) : (
        <ul className="mt-4 space-y-4">
          {exams.map((exam) => (
            <li key={exam._id} className="border p-4 rounded shadow hover:bg-gray-50">
              <a href={`/exam/${exam._id}`} className="text-xl font-medium text-indigo-600 hover:underline">
                {exam.title}
              </a>
              <p className="text-sm text-gray-500">
                {new Date(exam.startTime).toLocaleString()} - {new Date(exam.endTime).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
