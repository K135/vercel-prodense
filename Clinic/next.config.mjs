/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: ['@heroicons/react']
  },
  images: {
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
}

export default nextConfig