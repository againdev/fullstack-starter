import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const backend = (
  process.env.BACKEND_INTERNAL_URL ?? "http://127.0.0.1:4000"
).replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "standalone",
  async rewrites() {
    return [
      { source: "/graphql", destination: `${backend}/graphql` },
      { source: "/health", destination: `${backend}/health` },
    ];
  },
};

export default withNextIntl(nextConfig);
