import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://communitycommercemelissa.org";
  
  const routes = [
    "",
    "/about",
    "/contact",
    "/contact/feedback",
    "/leadership",
    "/directory",
    "/events",
    "/give-donate",
    "/donate",
    "/membership",
    "/membership/receipt",
    "/receipt",
    "/volunteer",
    "/sponsorship",
    "/spotlight",
    "/photos-videos",
    "/community",
    "/news",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/events" || route === "/news" ? "daily" : "weekly",
    priority: route === "" ? 1.0 : route === "/directory" || route === "/membership" ? 0.9 : 0.7,
  }));
}
