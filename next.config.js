/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  images: {
    domains: [
      "steamcdn-a.akamaihd.net",
      "avatars.steamstatic.com",
      "deadbydaylight.com",
    ],
  },
};

module.exports = nextConfig;
