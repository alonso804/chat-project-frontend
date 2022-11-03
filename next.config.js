/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    API_URI: process.env.API_URI,
    JWT_SECRET: process.env.JWT_SECRET,
  },
};

module.exports = nextConfig;
