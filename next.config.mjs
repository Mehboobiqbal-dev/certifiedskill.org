/** @type {import('next').NextConfig} */
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: { enabled: true },
    allowedDevOrigins: ['*'], // Allow every origin in development
    // Add output file tracing configuration to reduce serverless function size
    outputFileTracingRoot: __dirname,
    outputFileTracingExcludes: {
      '*': [
        // Exclude large dependencies that are only used in specific contexts
        'node_modules/@mediapipe/**',
        'node_modules/puppeteer-extra/**',
        'node_modules/puppeteer-extra-plugin-stealth/**',
        'node_modules/face-api.js/**',
        'node_modules/pdfkit/**',
        // Exclude test files and documentation
        'node_modules/**/*.md',
        'node_modules/**/*.test.js',
        'node_modules/**/*.spec.js',
        'node_modules/**/*.d.ts',
        'node_modules/**/*.map',
      ],
    },
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
