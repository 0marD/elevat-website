/** @type {import('next').NextConfig} */
const withPWA = require('@ducanh2912/next-pwa').default({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  customWorkerSrc: 'worker',
})

// ─── Content-Security-Policy ──────────────────────────────────────────────────
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-eval' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' blob: data: https://images.unsplash.com https://res.cloudinary.com",
  "connect-src 'self' https://api.resend.com",
  "frame-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ')

/** @type {import('next').NextConfig['headers']} */
async function headers() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options',   value: 'nosniff' },
        { key: 'X-Frame-Options',          value: 'DENY' },
        { key: 'X-XSS-Protection',         value: '1; mode=block' },
        { key: 'Referrer-Policy',          value: 'strict-origin-when-cross-origin' },
        {
          key: 'Permissions-Policy',
          value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
        },
        {
          key: 'Strict-Transport-Security',
          value: 'max-age=63072000; includeSubDomains; preload',
        },
        { key: 'Content-Security-Policy', value: CSP },
      ],
    },
  ]
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  headers,
  turbopack: {},
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },
}

module.exports = withPWA(nextConfig)
