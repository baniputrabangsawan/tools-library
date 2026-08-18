import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  // Keep production builds separate from the development server cache.
  // Running `pnpm build` while `pnpm dev` is active must not replace its assets.
  distDir: process.env.NEXT_OUTPUT_DIR ?? ".next",
  outputFileTracingRoot: path.join(__dirname),
};

export default nextConfig;
