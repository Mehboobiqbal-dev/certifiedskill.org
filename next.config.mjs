/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: true, // Enable Turbopack
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
        // If needed, add other modules such as 'crypto' or 'stream'
      };
    }
    return config;
  },
};

export default nextConfig;
