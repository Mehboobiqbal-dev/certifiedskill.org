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
    <header className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-black py-4 px-6 sticky top-0 w-full z-50 shadow-lg transition-all duration-300 ease-in-out transform">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        {/* Logo with Structured Data */}
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

        {/* Navigation Links with Semantic Markup */}
        <nav
          className="space-x-4 flex items-center"
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
