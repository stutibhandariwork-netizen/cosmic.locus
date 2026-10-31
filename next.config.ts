import type { NextConfig } from "next";

/** Served from https://stutibhandariwork-netizen.github.io/cosmic.locus as static files. */
export const BASE_PATH = "/cosmic.locus";

const nextConfig: NextConfig = {
  output: "export",
  basePath: BASE_PATH,
  trailingSlash: true,
  images: { unoptimized: true },
  env: { NEXT_PUBLIC_BASE_PATH: BASE_PATH },
};

export default nextConfig;
