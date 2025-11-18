import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // allow Cloudinary host used for uploaded product images
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
