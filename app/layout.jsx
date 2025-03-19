// app/layout.jsx
export const metadata = {
    title: "CertifySkill.org",
    description: "Your Certification Platform",
  };
  
  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <head />
        <body>
          {children}
        </body>
      </html>
    );
  }
  