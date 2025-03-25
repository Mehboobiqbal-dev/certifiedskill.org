// components/Footer.jsx

import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 text-black py-4 px-6 w-full shadow-lg transition-all duration-300 ease-in-out transform">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} CertifiedSkill.org. All rights reserved.
        </p>

        <nav>
          <Link href="/careers" className="text-sm font-medium hover:underline">
            Careers
          </Link>
        </nav>

        <nav>
          <Link href="/privacy" className="text-sm font-medium hover:underline">
            Privacy Policy
          </Link>
        </nav>

        <nav>
          <Link href="/faq-tc" className="text-sm font-medium hover:underline">
            FAQ
          </Link>
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
