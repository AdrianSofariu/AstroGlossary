import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    API_CONNECTION_STRING: "http://172.30.244.168:3001/api",
    API_SOCKET: "http://172.30.244.168:3001",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "darksky.org",
        pathname: "/app/uploads/2021/07/DSC_8700-Pano-Edit-scaled.jpg",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname:
          "/wikipedia/commons/thumb/e/e1/FullMoon2010.jpg/1200px-FullMoon2010.jpg",
      },
      {
        protocol: "https",
        hostname: "upload.wikimedia.org",
        pathname:
          "/wikipedia/commons/c/ca/Star-forming_region_S106_%28captured_by_the_Hubble_Space_Telescope%29.jpg",
      },
      {
        protocol: "http", // Use 'http' for local development server (Next.js uses http locally by default)
        hostname: "192.168.0.14",
        pathname: "/images/*", // Allow any image in the /images/ folder
      },
      {
        protocol: "http", // Use 'http' for local development server (Next.js uses http locally by default)
        hostname: "172.30.244.167",
        pathname: "/images/*", // Allow any image in the /images/ folder
      },
      {
        protocol: "http", // Allow any subdomain of localhost
        hostname: "*.localhost",
        pathname: "/images/*", // Allow any image in the /images/ folder
      },
      {
        protocol: "https",
        hostname: "*",
      },
    ],
  },
};

export default nextConfig;
