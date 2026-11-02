import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    resolveAlias: {
      // The flipbook SDK imports pdf.js's modern build, which needs features only the newest
      // browsers have (Map.getOrInsert, Math.sumPrecise…). The legacy build is the same version
      // with those polyfilled, so the book opens on older phones too.
      "pdfjs-dist": "pdfjs-dist/legacy/build/pdf.mjs",
    },
  },
};

export default nextConfig;
