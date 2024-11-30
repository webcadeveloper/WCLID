/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost', // O la dirección que sea relevante para tu caso
      },
    ],
  },
}

module.exports = nextConfig;
