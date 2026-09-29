/** Web app manifest (installable / nicer mobile home-screen icon). */
import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: "CTW",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fbfaf6",
    theme_color: "#0e0e0e",
    icons: [{ src: "/icon.png", sizes: "512x512", type: "image/png" }],
  };
}
