"use client";

import { useSession, SessionProvider } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import UserButton from "../components/user-button";
import { FaBell, FaMoon, FaSun } from "react-icons/fa";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/careers", label: "Careers" },
  { href: "/faq-tc", label: "FAQ" },
];

const HeaderContent = () => {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const menuRef = useRef(null);

  // Sync dark mode with html class and persist for session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("darkMode");
      if (saved === "true") {
        setDarkMode(true);
        document.documentElement.classList.add("dark");
      }
    }
  }, []);

  const handleDarkMode = () => {
    setDarkMode((d) => {
      const next = !d;
      if (typeof window !== "undefined") {
        if (next) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("darkMode", next ? "true" : "false");
      }
      return next;
    });
  };

  return (
    <header className="bg-white/70 dark:bg-gray-900/80 backdrop-blur-lg sticky top-0 w-full z-50 shadow-lg border-b border-indigo-100 dark:border-gray-800 transition-colors">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" aria-label="CertifiedSkill.org Homepage" className="flex items-center gap-2">
            <img src="/ChatGPT Image Jul 19, 2025, 01_06_54 PM.png" alt="Logo" className="h-9 w-9 rounded shadow-lg" />
            <span className="text-2xl font-extrabold text-indigo-700 dark:text-white tracking-tight drop-shadow">CertifiedSkill.org</span>
          </Link>
        </div>
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-base font-semibold text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition">
              {link.label}
            </Link>
          ))}
          {/* Notification Bell */}
          <button className="relative p-2 rounded-full hover:bg-indigo-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400" aria-label="Notifications">
            <FaBell className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
          </button>
          {/* Dark Mode Toggle */}
          <button
            className="p-2 rounded-full hover:bg-indigo-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            aria-label="Toggle dark mode"
            onClick={handleDarkMode}
          >
            {darkMode ? <FaSun className="w-5 h-5 text-yellow-400" /> : <FaMoon className="w-5 h-5 text-indigo-700" />}
          </button>
          {/* User Avatar/Dropdown */}
          <UserButton />
        </div>
        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded hover:bg-indigo-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
        >
          <svg className="w-7 h-7 text-indigo-700 dark:text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>
      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-indigo-100 dark:border-gray-800 shadow-lg animate-fade-in-down" ref={menuRef}>
          <div className="flex flex-col gap-2 px-4 py-4">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-base font-semibold text-gray-700 dark:text-gray-200 hover:text-indigo-600 dark:hover:text-indigo-400 transition py-2">
                {link.label}
              </Link>
            ))}
            <div className="flex items-center gap-4 mt-2">
              <button className="relative p-2 rounded-full hover:bg-indigo-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400" aria-label="Notifications">
                <FaBell className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-gray-900"></span>
              </button>
              <button
                className="p-2 rounded-full hover:bg-indigo-50 dark:hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                aria-label="Toggle dark mode"
                onClick={handleDarkMode}
              >
                {darkMode ? <FaSun className="w-5 h-5 text-yellow-400" /> : <FaMoon className="w-5 h-5 text-indigo-700" />}
              </button>
              <UserButton />
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

const Header = () => (
  <SessionProvider>
    <HeaderContent />
  </SessionProvider>
);

export default Header;
