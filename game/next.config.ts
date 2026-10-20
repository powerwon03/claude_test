import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // 이 폴더가 저장소의 하위 폴더라서 프로젝트 루트를 명시합니다.
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
