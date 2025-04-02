"use client";

import { useSession, SessionProvider } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import UserButton from "../components/user-button";

// A reusable exam search component with auto-suggestions
const ExamSearch = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const searchContainerRef = useRef(null);

  // Fetch recommended exams whenever the search query changes
  useEffect(() => {
    // Only fetch if query has at least 2 characters to avoid too many requests
    if (searchQuery.trim().length < 2) {
      setRecommendations([]);
      return;
    }

    const queryLower = searchQuery.toLowerCase();

    // Fetch suggestions from your API (adjust URL as needed)
    fetch(`/api/exams?query=${encodeURIComponent(searchQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        // If your API isn't filtering, apply a filter client-side.
        const filteredData = data.filter((exam) =>
          (exam.title || "").toLowerCase().includes(queryLower)
        );
        setRecommendations(filteredData);
      })
      .catch((err) => {
        console.error("Error fetching exam recommendations:", err);
        setRecommendations([]);
      });
  }, [searchQuery]);

  // Hide recommendations when clicking outside the component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target)
      ) {
        setRecommendations([]);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () =>
      document.removeEventListener("click", handleClickOutside);
  }, []);

  // Handle the search form submission
  const handleSearchFormSubmit = (e) => {
    e.preventDefault();
    // Optionally, clear suggestions when submitting
    setRecommendations([]);
    // Navigate to a search results page with the query parameter (if needed)
    router.push(`/search-exam?query=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <div className="relative" ref={searchContainerRef}>
      <form onSubmit={handleSearchFormSubmit} className="flex">
        <input
          type="text"
          placeholder="Search exams..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-gray-300 p-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-indigo-600 text-white px-4 py-2 rounded-r-md"
        >
          Search
        </button>
      </form>
      {/* Recommendation dropdown */}
      {recommendations.length > 0 && (
        <ul className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-b-md shadow-md mt-1 z-50">
          {recommendations.map((exam) => (
            <li
              key={exam._id}
              className="px-4 py-2 hover:bg-gray-100"
            >
              <Link href={`/exam/${exam._id}`}>
                <span className="cursor-pointer">{exam.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const HeaderContent = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { data: session, status } = useSession();
  const menuRef = useRef(null);

  // Close menu when clicking outside the menu area
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("click", handleClickOutside);
    }
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className="bg-white/30 backdrop-blur-md text-black py-4 px-4 sm:px-5 sticky top-0 w-full z-50 shadow-lg transition-all duration-300 ease-in-out">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0" itemScope itemType="http://schema.org/Organization">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            aria-label="CertifiedSkill.org Homepage"
            itemProp="url"
          >
            <h1
              className="text-xl md:text-2xl font-bold transform hover:scale-105 transition duration-300"
              itemProp="name"
            >
              CertifiedSkill.org
            </h1>
          </Link>
        </div>

        {/* Exam Search */}
        <div className="flex-grow mx-4">
          <ExamSearch />
        </div>

        {/* Navigation Links */}
        <nav
          className="flex items-center space-x-4"
          itemScope
          itemType="http://schema.org/SiteNavigationElement"
        >
          {status === "authenticated" && (
            <Link
              href="/dashboard"
              className="text-lg font-medium hover:underline"
              itemProp="url"
            >
              Dashboard
            </Link>
          )}
          <UserButton />
        </nav>
      </div>
    </header>
  );
};

const Header = () => (
  <SessionProvider>
    <HeaderContent />
  </SessionProvider>
);

export default Header;
