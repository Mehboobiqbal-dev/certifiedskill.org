import Header from "./Header";
import Footer from "./Footer";

export default function Leaderboard() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 flex flex-col items-center">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl border border-indigo-100 p-8">
          <h1 className="text-3xl font-bold text-indigo-700 mb-8 text-center">Leaderboard</h1>
          {/* TODO: Dynamic leaderboard of top users */}
          <div className="mb-8 bg-indigo-50 rounded-lg p-4 text-center text-gray-500">Top users will be displayed here.</div>
          {/* TODO: Badges and achievements */}
          <div className="bg-indigo-50 rounded-lg p-4 text-center text-gray-500">Badges and achievements will be displayed here.</div>
        </div>
      </main>
      <Footer />
    </>
  );
} 