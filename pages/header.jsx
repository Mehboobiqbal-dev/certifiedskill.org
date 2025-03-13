"use client";
import { SessionProvider } from "next-auth/react";
import UserButton from "../components/user-button";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

const HeaderContent = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        event.target.getAttribute('aria-label') !== 'Toggle Navigation Menu'
      ) {
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
    <header className="bg-gradient-to-br from-[#141e30] to-[#243b55] text-white py-2 px-4 sticky top-0 w-full z-50 shadow-md overflow-x-hidden">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        {/* Logo */}
        

        {/* User Button and Menu Toggle */}
        <div className="flex items-center">
          <UserButton />

          {/* Menu Toggle Button */}
          <button
            className="text-2xl text-white ml-4"
            aria-expanded={menuOpen}
            aria-controls="main-menu"
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen((prev) => !prev);
            }}
            aria-label="Toggle Navigation Menu"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav
        ref={menuRef}
        id="main-menu"
        className={`${
          menuOpen ? 'block' : 'hidden'
        } bg-gradient-to-br from-[#141e30] to-[#243b55] text-white transition-all duration-400 overflow-x-hidden`}
      >
        <div className="max-w-screen-xl mx-auto px-4">
          <ul className="text-center">
            <li className="py-2">
              <Link
                href="/home"
                onClick={() => setMenuOpen(false)}
                aria-label="Go to Home Page"
                className="hover:text-[#FFD700] transition-colors duration-200"
              >
                Home
              </Link>
            </li>
            
          </ul>
        </div>
      </nav>
    </header>
  );
};

const Header = () => (
  <SessionProvider>
    <HeaderContent />
  </SessionProvider>
);

export default Header;