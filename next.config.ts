import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  env: {
    NEXT_PUBLIC_API_CONNECTION_STRING:
      "https://astroapi-production-3f43.up.railway.app/api",
    NEXT_PUBLIC_API_SOCKET:
      "https://astroapi-production-3f43.up.railway.app:3001",
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
        hostname: "media.istockphoto.com",
        pathname: "/id/**",
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
        protocol: "http", // Allow any subdomain of localhost
        hostname: "api.com",
        pathname: "/images/*", // Allow any image in the /images/ folder
      },
      {
        protocol: "https",
        hostname: "ddhsrmlyaesxltelztba.supabase.co", // your actual Supabase hostname
        pathname: "/storage/v1/object/public/images/**", // your bucket + path
      },
    ],
  },
};

export default nextConfig;
