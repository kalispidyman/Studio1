/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // If your project uses the App Router, this handles trailing slashes for static hosting
  trailingSlash: true,
  allowedDevOrigins: ['192.168.29.7'],
};

export default nextConfig;
