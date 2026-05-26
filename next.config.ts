import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gsnucnwpamyxpjxymjlf.supabase.co', // Replace with your image's hostname
        port: '',
        pathname: '/**', // Matches all paths under this domain
      },
    ],
  },
};

export default nextConfig;
