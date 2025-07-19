"use client";

import { useSession, SessionProvider } from "next-auth/react";
import { useState, useRef } from "react";
import Link from "next/link";
import UserButton from "../components/user-button";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/careers", label: "Careers" },
  { href: "/faq-tc", label: "FAQ" },
];

const HeaderContent = () => {
  const { data: session, status } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 w-full z-50 shadow-md border-b border-indigo-100">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Link href="/" aria-label="CertifiedSkill.org Homepage" className="flex items-center gap-2">
            <img src="/ChatGPT Image Jul 19, 2025, 01_06_54 PM.png" alt="Logo" className="h-8 w-8 rounded" />
            <span className="text-xl md:text-2xl font-bold text-indigo-700 tracking-tight">CertifiedSkill.org</span>
          </Link>
        </div>
        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-base font-medium text-gray-700 hover:text-indigo-600 transition">
              {link.label}
            </Link>
          ))}
          <UserButton />
        </div>
        {/* Mobile Menu Button */}
        <button
          className="md:hidden flex items-center justify-center p-2 rounded hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
        >
          <svg className="w-7 h-7 text-indigo-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        </nav>
      {/* Mobile Nav */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-indigo-100 shadow-lg animate-fade-in-down" ref={menuRef}>
          <div className="flex flex-col gap-2 px-4 py-4">
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={link.href} className="text-base font-medium text-gray-700 hover:text-indigo-600 transition py-2">
                {link.label}
              </Link>
            ))}
            <UserButton />
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
