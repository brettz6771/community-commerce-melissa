import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://communitycommercemelissa.org";
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/api/", "/admin", "/admin/", "/member-portal", "/member-portal/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
