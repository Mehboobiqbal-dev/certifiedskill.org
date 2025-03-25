import Link from "next/link";

const Footer = () => {
  return (
    <footer
      style={{
        background: "rgba(255, 255, 255, 0.1)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        borderTop: "1px solid rgba(255, 255, 255, 0.2)",
      }}
      className="text-black py-4 px-6 w-full shadow-lg transition-all duration-300 ease-in-out transform"
    >
      <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
        <p className="text-sm">
          &copy; {new Date().getFullYear()} CertifiedSkill.org. All rights reserved.
        </p>
        <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
          <Link href="/careers" className="text-sm font-medium hover:underline">
            Careers
          </Link>
          <Link href="/privacy" className="text-sm font-medium hover:underline">
            Privacy Policy
          </Link>
          <Link href="/faq-tc" className="text-sm font-medium hover:underline">
            FAQ
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
