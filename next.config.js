/** @type {import('next').NextConfig} */

const path = require('path');
require('dotenv').config()
const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  images: {
    remotePatterns: [
      {
        protocol:'https',
        hostname: 'listing-images.homejunction.com',
        port: '',
        pathname: '/**'
      }
    ]
  }
}

module.exports = nextConfig
