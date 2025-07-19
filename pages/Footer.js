// components/Footer.jsx

import Link from "next/link";

const FOOTER_LINKS = [
  { href: "/careers", label: "Careers" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/faq-tc", label: "FAQ" },
];

const SOCIALS = [
  { href: "https://linkedin.com/company/certifiedskill", icon: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.37-1.54 2.82-1.54 3.01 0 3.57 1.98 3.57 4.56v4.75z" /></svg>
  ) },
  { href: "https://twitter.com/certifiedskill", icon: (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.56c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.956-2.178-1.555-3.594-1.555-2.72 0-4.924 2.204-4.924 4.924 0 .386.044.762.127 1.124-4.092-.205-7.719-2.166-10.148-5.144-.424.729-.666 1.577-.666 2.476 0 1.708.87 3.216 2.188 4.099-.807-.026-1.566-.247-2.23-.616v.062c0 2.386 1.697 4.374 3.95 4.827-.413.112-.849.172-1.298.172-.318 0-.626-.03-.927-.086.627 1.956 2.444 3.379 4.6 3.419-1.684 1.32-3.808 2.107-6.115 2.107-.398 0-.79-.023-1.175-.069 2.179 1.397 4.768 2.213 7.548 2.213 9.057 0 14.012-7.506 14.012-14.012 0-.213-.005-.425-.014-.636.962-.695 1.797-1.562 2.457-2.549z" /></svg>
  ) },
];

const Footer = () => {
  return (
    <footer className="bg-white border-t border-indigo-100 shadow-inner mt-12">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 px-6 py-6">
        <div className="flex items-center gap-2">
          <img src="/ChatGPT Image Jul 19, 2025, 01_06_54 PM.png" alt="Logo" className="h-7 w-7 rounded" />
          <span className="text-lg font-bold text-indigo-700">CertifiedSkill.org</span>
        </div>
        <nav className="flex gap-6 items-center mt-2 md:mt-0">
          {FOOTER_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition">
              {link.label}
          </Link>
          ))}
        </nav>
        <div className="flex gap-4 items-center mt-2 md:mt-0">
          {SOCIALS.map((social) => (
            <a key={social.href} href={social.href} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-indigo-600 transition" aria-label="Social link">
              {social.icon}
            </a>
          ))}
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 py-2 border-t border-indigo-50">
        &copy; {new Date().getFullYear()} CertifiedSkill.org. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
