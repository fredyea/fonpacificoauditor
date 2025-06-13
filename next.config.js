/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'j4hvvf8.localto.net',
        port: '',
        pathname: '/pdf/**',
      },
      {
        protocol: 'http',
        hostname: 'j4hvvf8.localto.net',
        port: '',
        pathname: '/pdf/**',
      }
    ],
  }
}

module.exports = nextConfig 