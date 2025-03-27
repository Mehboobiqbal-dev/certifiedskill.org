// components/Footer.jsx

import Link from "next/link";

const Footer = () => {
  return (
    <footer
    style={{
      background: "rgba(255, 255, 255, 0.1)", // Super transparent background
      backdropFilter: "blur(10px)", // Blurs the content behind it
      WebkitBackdropFilter: "blur(10px)", // For Safari support
      borderTop: "1px solid rgba(255, 255, 255, 0.2)", // Optional border for added definition
    }}
    className="text-black py-4 px-6 w-full shadow-lg transition-all duration-300 ease-in-out transform"
  >
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} CertifiedSkill.org. All rights reserved.
        </p>
      <ul>
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
        </ul>
      </div>
    </footer>
  );
};

export default Footer;
