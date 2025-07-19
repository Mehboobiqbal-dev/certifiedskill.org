import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e0e7ef 100%)',
      color: '#1a202c',
      fontFamily: 'Inter, sans-serif',
      padding: '2rem',
    }}>
      <h1 style={{ fontSize: '5rem', fontWeight: 800, margin: 0 }}>404</h1>
      <h2 style={{ fontSize: '2rem', fontWeight: 600, margin: '1rem 0' }}>Page Not Found</h2>
      <p style={{ fontSize: '1.2rem', color: '#4b5563', maxWidth: 400, textAlign: 'center' }}>
        Sorry, the page you are looking for does not exist or has been moved. Please check the URL or return to the homepage.
      </p>
      <Link href="/">
        <a style={{
          marginTop: '2rem',
          padding: '0.75rem 2rem',
          background: 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)',
          color: '#fff',
          borderRadius: '0.5rem',
          fontWeight: 600,
          fontSize: '1rem',
          textDecoration: 'none',
          boxShadow: '0 2px 8px rgba(99,102,241,0.15)',
          transition: 'background 0.2s',
        }}
        onMouseOver={e => e.currentTarget.style.background = 'linear-gradient(90deg, #60a5fa 0%, #6366f1 100%)'}
        onMouseOut={e => e.currentTarget.style.background = 'linear-gradient(90deg, #6366f1 0%, #60a5fa 100%)'}
        >
          Go Home
        </a>
      </Link>
    </div>
  );
} 