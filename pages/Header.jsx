"use client";
import { SessionProvider } from "next-auth/react";
import UserButton from "./components/user-button";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";


const HeaderContent = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

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
    <header className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-black py-4 px-6 sticky top-0 w-full z-50 shadow-lg transition-all duration-300 ease-in-out transform">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <h1 className="text-2xl font-extrabold tracking-wide transform hover:scale-105 transition duration-300">
            <Link href="/" onClick={() => setMenuOpen(false)} aria-label="Home">
              Home
            </Link>
          </h1>
        </div>

        {/* User Button */}
        <UserButton />
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
