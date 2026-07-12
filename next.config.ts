import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a fully static site (HTML/CSS/JS) into `out/` on `next build`.
  // The app is frontend-only with mock data, so no server runtime is needed.
  output: "export",

  // Static hosts can't run Next.js Image Optimization; serve images as-is.
  images: { unoptimized: true },

  // Emit `/route/index.html` (folder-per-route) so links work on any static
  // host without server-side rewrites.
  trailingSlash: true,
};

export default nextConfig;
