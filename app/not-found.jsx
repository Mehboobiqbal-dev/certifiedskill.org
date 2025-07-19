import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-100 px-4 py-12">
      <h1 className="text-6xl font-extrabold text-indigo-700 mb-2">404</h1>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Page Not Found</h2>
      <p className="text-lg text-gray-500 max-w-md text-center mb-8">
        Sorry, the page you are looking for does not exist or has been moved. Please check the URL or return to the homepage.
      </p>
      <Link href="/" legacyBehavior>
        <a className="mt-4 px-8 py-3 bg-gradient-to-r from-indigo-600 to-blue-400 text-white rounded-lg font-semibold text-lg shadow hover:from-blue-400 hover:to-indigo-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2">
          Go Home
        </a>
      </Link>
    </div>
  );
} 