import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "www.communitycommercemelissa.org",
          },
        ],
        destination: "https://communitycommercemelissa.org/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
