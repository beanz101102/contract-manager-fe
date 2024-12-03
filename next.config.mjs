/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["localhost", "api.phatdat.online", "phatdat.online"],
  },
  output: 'standalone',
}

export default nextConfig
