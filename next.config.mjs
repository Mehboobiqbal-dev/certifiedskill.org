/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: { enabled: true },
    allowedDevOrigins: ['*'], // Allow every origin in development
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Provide fallbacks for Node built-ins so these modules are ignored on the client.
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        zlib: false,
      };
    }
    return config;
  },
  async headers() {
    return [
      {
        // Apply the headers to all routes.
        source: "/:path*",
        headers: [
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline' https://va.vercel-scripts.com; " +
              "style-src 'self' 'unsafe-inline'; " +
              "frame-ancestors https://monospace.corp.google.com https://localhost.corp.google.com:10443;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
