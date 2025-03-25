"use client";

import { useSession, SessionProvider } from "next-auth/react";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import UserButton from "../components/user-button";

const HeaderContent = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const { data: session, status } = useSession();

  // Close menu when clicking outside
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
    <header
      style={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
      }}
      className="text-black py-4 px-6 sticky top-0 w-full z-50 shadow-lg transition-all duration-300 ease-in-out transform"
    >
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
              className="text-2xl font-extrabold tracking-wide transform hover:scale-105 transition duration-300"
              itemProp="name"
            >
              CertifiedSkill.org
            </h1>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav
          className="hidden md:flex space-x-4"
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

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-black focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            /* X icon when menu open */
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : (
            /* Hamburger icon when menu closed */
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Navigation Menu */}
      {menuOpen && (
        <div
          ref={menuRef}
          className="md:hidden mt-2 bg-white/90 backdrop-blur-sm text-black rounded shadow-lg"
        >
          <nav className="flex flex-col divide-y">
            {status === "authenticated" && (
              <Link
                href="/dashboard"
                className="px-4 py-2 hover:bg-gray-100"
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}
            <div className="px-4 py-2 hover:bg-gray-100">
              <UserButton />
            </div>
          </nav>
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
