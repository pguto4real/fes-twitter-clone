/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["firebasestorage.googleapis.com"],
    unoptimized: true,
  },
  // output: "export",
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
